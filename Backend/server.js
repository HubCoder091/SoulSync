const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Allow frontend communication
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware
app.use(express.json());
app.use(cors()); // Allow requests from frontend
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/soulsync';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Journal Schema
const JournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // Store the username
  content: { type: String, required: true }, // Journal text
  date: { type: Date, default: Date.now } // Save timestamp
});
const Journal = mongoose.model('Journal', JournalSchema);

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: '✅ User registered successfully' });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: '❌ User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '❌ Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: '✅ Login successful', token });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
// Fetch User Info Route
app.get('/user', verifyToken, async (req, res) => {
  try {
    res.json({ username: req.user.username });
  } catch (error) {
    console.error('❌ Fetch User Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Save Journal Entry
app.post('/save-journal', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Journal content is required' });
    }

    const newEntry = new Journal({
      userId: req.user.userId,
      username: req.user.username,
      content
    });

    await newEntry.save();
    res.json({ message: '✅ Journal entry saved successfully' });
  } catch (error) {
    console.error('❌ Journal Save Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get All Journals for Logged-in User
app.get('/journals', verifyToken, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.userId }).sort({ date: -1 }); // Sort by latest first

    res.json(journals);
  } catch (error) {
    console.error('❌ Fetch Journals Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Serve the login.html file
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

const AssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  setNumber: { type: Number, required: true }, // 1 or 2 to identify which set
  responses: { type: Object, required: true }, // Store all question answers
  completedAt: { type: Date, default: Date.now }
});
const Assessment = mongoose.model('Assessment', AssessmentSchema);

/// Check Assessment Status - to see if user has completed set 1
app.get('/assessment-status', verifyToken, async (req, res) => {
  try {
    // Find the most recent assessment for this user
    const latestAssessment = await Assessment.findOne(
      { userId: req.user.userId }
    ).sort({ completedAt: -1 });
    
    // Add debugging
    console.log('Latest assessment:', latestAssessment);
    
    if (!latestAssessment) {
      // No assessments found, user should start with set 1
      return res.json({ nextSet: 1, canTakeSet2: false });
    }
    
    // Changed from hours to minutes - now using 1 minute instead
    const minutesSinceLastAssessment = (Date.now() - latestAssessment.completedAt.getTime()) / (1000 * 60);
    console.log('Minutes since last assessment:', minutesSinceLastAssessment);
    
    // If they've only done set 1 and enough time has passed, they can do set 2
    if (latestAssessment.setNumber === 1 && minutesSinceLastAssessment >= 1) {
      return res.json({ nextSet: 2, canTakeSet2: true });
    } 
    // If they've only done set 1 but not enough time has passed
    else if (latestAssessment.setNumber === 1) {
      const remainingMinutes = Math.max(0, Math.ceil(1 - minutesSinceLastAssessment));
      console.log('Remaining minutes calculated:', remainingMinutes);
      
      return res.json({ 
        nextSet: 2, 
        canTakeSet2: false,
        minutesRemaining: remainingMinutes 
      });
    }
    
    // If they've completed both sets, they've finished the assessment
    else if (latestAssessment.setNumber === 2) {
      return res.json({ completed: true });
    }
    
    // Default case
    return res.json({ nextSet: 1, canTakeSet2: false });
    
  } catch (error) {
    console.error('❌ Assessment Status Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/save-assessment', verifyToken, async (req, res) => {
  try {
    const { responses, setNumber } = req.body;
    
    if (!responses || !setNumber) {
      return res.status(400).json({ message: 'Responses and set number are required' });
    }

    const newAssessment = new Assessment({
      userId: req.user.userId,
      username: req.user.username,
      setNumber: parseInt(setNumber),
      responses,
      completedAt: new Date()
    });

    await newAssessment.save();

    // If setNumber is 1, calculate the time for set 2
    if (setNumber === 1) {
      const waitTime = 5; // 5 minutes wait time for set 2
      const waitUntil = new Date(new Date().getTime() + waitTime * 60000);

      // Save the waitUntil time in the user's document or session
      await User.findByIdAndUpdate(req.user.userId, { waitUntil });
    }

    res.json({ message: '✅ Assessment saved successfully' });
  } catch (error) {
    console.error('❌ Assessment Save Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/assessment-status', verifyToken, async (req, res) => {
  try {
    // Find the most recent assessment for this user
    const latestAssessment = await Assessment.findOne(
      { userId: req.user.userId }
    ).sort({ completedAt: -1 });
    
    if (!latestAssessment) {
      // No assessments found, user should start with set 1
      return res.json({ nextSet: 1, canTakeSet2: false });
    }
    
    // Calculate if enough time has passed to take set 2 (1 minute instead of 24 hours)
    const minutesSinceLastAssessment = 
      (Date.now() - latestAssessment.completedAt.getTime()) / (1000 * 60);
    
    // If they've only done set 1 and enough time has passed, they can do set 2
    if (latestAssessment.setNumber === 1 && minutesSinceLastAssessment >= 1) {
      return res.json({ nextSet: 2, canTakeSet2: true });
    } 
    // If they've only done set 1 but not enough time has passed
    else if (latestAssessment.setNumber === 1) {
      return res.json({ 
        nextSet: 2, 
        canTakeSet2: false,
        minutesRemaining: Math.ceil(1 - minutesSinceLastAssessment)
      });
    }
    // If they've completed both sets, they've finished the assessment
    else if (latestAssessment.setNumber === 2) {
      return res.json({ completed: true });
    }
    
    // Default case
    return res.json({ nextSet: 1, canTakeSet2: false });
    
  } catch (error) {
    console.error('❌ Assessment Status Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});