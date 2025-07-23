📘 SoulSync - Mental Wellness Companion
SoulSync is a personal mental wellness web application that helps users log in securely, view personalized content, and manage their mental health using tools like journals, self-assessments, therapy resources, and relaxation activities.

📁 Project Structure
bash
SoulSync/
│
├── backend/
│   └── server.js                # Express.js backend connected to MongoDB
│
├── frontend/
│   ├── home.html                # Home/Dashboard page (user info displayed)
│   ├── login.html               # Login page (stores token in localStorage)
│   ├── register.html            # Registration page
│   ├── journal.html             # Journal tool
│   ├── assessment.html          # Self-assessment tool
│   ├── R_Tools.html             # Relaxation tools
│   ├── mood.html                # Mood tracker
│   ├── therapy.html             # Therapy resources
│   ├── styles/                  # CSS files
│   └── Images/                  # Background and UI images
│
├── .env                         # Environment variables (Mongo URI, JWT)
└── README.md                    # Project documentation

🚀 Features
✅ User Authentication

Registration and Login using JWT tokens

Passwords stored securely using bcrypt

🧠 Mental Wellness Dashboard

Journaling

Self-assessments

Therapy resources

Relaxation tools and mood tracker

🙋‍♂️ Personalized Welcome

Displays the logged-in user's name on the home page after verifying the token from local storage

🛠️ Technologies Used
Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JSON Web Tokens (JWT)

Security: bcrypt.js for password hashing

Communication: CORS for frontend-backend interaction

🔐 Environment Setup
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/soulsync.git
cd soulsync
2. Setup Backend (server.js)
Install required packages:

bash
Copy
Edit
cd backend
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
Create .env file in the backend/ folder:

env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/soulsync
JWT_SECRET=your_jwt_secret_key
Start MongoDB locally:

bash
Copy
Edit
mongod
Run the server:

bash
Copy
Edit
node server.js
Server should run on: http://localhost:5000

🖥️ Frontend Setup
Open frontend/home.html in your browser directly or use a simple server:

bash
Copy
Edit
cd frontend
npx live-server
Or drag login.html into your browser if no server is used.

🔐 Authentication Flow
User logs in via login.html → receives JWT token.

Token is stored in localStorage.

home.html fetches /user from backend with this token.

Username is decoded and displayed in the top-right corner.

📡 API Endpoints
Method	Route	Description	Auth Required
POST	/register	Register a new user	❌
POST	/login	Log in and receive JWT	❌
GET	/user	Get logged-in user's info	✅
POST	/save-journal	Save a journal entry	✅
GET	/journals	Get user's journal entries	✅

🧪 Testing the Flow
Open register.html and create a new account.

Login using login.html and check DevTools > Application > Local Storage → token should be stored.

Open home.html. You should see "Hi, <username> ✌" in the top-right corner.

Use Journal, Relaxation Tools, or Assessment pages from dashboard.

🚨 Common Issues
Token not working?
Check if Authorization header is being sent as Bearer <token> in JavaScript fetch.

CORS error?
Ensure backend has cors() middleware enabled and running on port 5000.

MongoDB not connecting?
Make sure MongoDB service is running locally: mongod

✅ Future Enhancements
Add email support for verification.

Add dark mode toggle.

Include Google OAuth for login.

Save mood/assessment scores.

Deploy on Render/Netlify + MongoDB Atlas.

👨‍💻 Author
Built by Rohith — a developer passionate about mental wellness and creative tech.

📃 License
MIT License
