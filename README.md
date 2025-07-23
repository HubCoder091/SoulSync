📘 SoulSync - Mental Wellness Companion
SoulSync is a personal mental wellness web application that helps users securely log in, view personalized content, and manage their mental health using tools like journals, self-assessments, therapy resources, and relaxation activities.

📁 Project Structure
text
SoulSync/
│
├── backend/
│   └── server.js                # Express.js backend connected to MongoDB
│
├── frontend/
│   ├── home.html                # Home/Dashboard page
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   ├── journal.html             # Journal tool
│   ├── assessment.html          # Self-assessment tool
│   ├── R_Tools.html             # Relaxation tools
│   ├── mood.html                # Mood tracker
│   ├── therapy.html             # Therapy resources
│   ├── styles/                  # CSS styles
│   └── Images/                  # UI and background images
│
├── .env                         # Environment variables (Mongo URI, JWT secret)
└── README.md                    # Project documentation
🚀 Features
✅ User Authentication
Registration and login using JWT tokens

Passwords hashed with bcrypt.js

🧠 Mental Wellness Dashboard
Journal Tool

Self-Assessment

Mood Tracking

Relaxation Tools

Therapy Resources

🙋‍♂️ Personalized User Experience
Displays logged-in user’s name on the Home page after verifying token from localStorage.

🛠️ Technologies Used
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express.js
Database	MongoDB with Mongoose ODM
Auth	JSON Web Tokens (JWT)
Security	bcrypt.js
Communication	CORS middleware
🔐 Environment Setup
1. Clone the Repository
bash
git clone https://github.com/your-username/soulsync.git
cd soulsync
2. Setup Backend
bash
cd backend
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
Create a .env file inside the backend/ directory:

text
MONGO_URI=mongodb://localhost:27017/soulsync
JWT_SECRET=your_jwt_secret_key
Start MongoDB locally:

bash
mongod
Run the server:

bash
node server.js
Server runs at: http://localhost:5000

🖥️ Frontend Setup
You can:

Open frontend/home.html directly in a browser
OR

Use a live server:

bash
cd frontend
npx live-server
🔐 Authentication Flow
User logs in via login.html

Receives and stores JWT token into localStorage

home.html fetches /user with the token in headers

Decoded username is displayed in the top-right corner (e.g., “Hi, username ✌”)

📡 API Endpoints
Method	Route	Description	Auth Required
POST	/register	Register a new user	❌ No
POST	/login	Log in and receive JWT	❌ No
GET	/user	Get user info via token	✅ Yes
POST	/save-journal	Save journal entry	✅ Yes
GET	/journals	Retrieve journal entries	✅ Yes
🧪 Testing the Flow
Open register.html to create a new account

Log in using login.html

Check the browser's DevTools → Application → Local Storage

A token should be saved

Open home.html, and you should see:

text
Hi, <username> ✌
Explore ➜ Journal, Mood Tracker, Relaxation Tools, etc.

🚨 Common Issues & Fixes
Issue	Solution
Token not working?	Ensure you're sending Authorization: Bearer <token>
CORS error?	Confirm that backend uses cors() middleware
MongoDB not connecting?	Make sure mongod is running first
✅ Future Enhancements
Email verification

Dark mode toggle

Google OAuth login

Save mood & assessment scores

Deploy using MongoDB Atlas + Netlify/Render

👨‍💻 Author
Rohith — a developer passionate about mental wellness and building creative tech-driven tools that help people.

📃 License
Released under the MIT License.
