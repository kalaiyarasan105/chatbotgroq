# Groq AI-Powered FastAPI Chatbot

An AI-powered chatbot application featuring a modern, dark-mode glassmorphic user interface. The backend is built with Python and FastAPI, serving the static assets and forwarding client prompts to the Groq API using the high-performance Llama 3 model (`llama3-8b-8192`).

## Features

- **Llama 3 AI Engine**: Powered by Groq's super-fast Llama 3 model for intelligent, contextual responses.
- **Modern Glassmorphic UI**: Beautiful, premium dark mode interface with background glowing orbs, drop shadows, and high responsiveness.
- **Micro-Animations**: Smooth entry animations for chat bubbles and a realistic typing indicator.
- **Dedicated Service Layer**: AI logic is separated from endpoints, allowing modular maintenance and configuration.
- **Resilient Config Handling**: The application handles missing or invalid API keys gracefully, informing the user via UI prompts instead of crashing the backend server.
- **Static File Serving**: Serves frontend assets directly from the FastAPI backend.

---

## Directory Structure

```text
chatbot-project/
│
├── main.py               # FastAPI server, endpoints, and route controllers
├── requirements.txt      # Python dependencies
├── .env                  # Environment file (ignored by git) for GROQ_API_KEY
├── README.md             # Project documentation
├── .gitignore            # Git exclusion rules
│
├── services/
│   └── groq_service.py   # Groq API connection and prompt generator service
│
├── templates/
│   └── index.html        # Front-end HTML interface
│
└── static/
    ├── style.css         # Glassmorphism CSS design
    └── script.js         # JavaScript interface logic
```

---

## Installation & Setup

### Prerequisites
- Python 3.8 or higher installed on your machine.
- A Groq API Key (obtainable from the [Groq Console](https://console.groq.com/keys)).

### 1. Create a Virtual Environment
It is recommended to run the project inside a python virtual environment:
```bash
# Create the environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (macOS/Linux)
source venv/bin/activate
```

### 2. Install Dependencies
Install the required packages using pip:
```bash
pip install -r requirements.txt
```

### 3. Create Environment File
Create a `.env` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

---

## Running the Application

Start the FastAPI development server:
```bash
python main.py
```
Or run directly with Uvicorn:
```bash
uvicorn main:app --reload
```

Once running, access the web interface in your browser:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

For testing/exploring the raw REST API, view the auto-generated documentation:
👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Technologies Used

- **Backend**: Python 3, FastAPI, Pydantic, Uvicorn, Groq SDK, Python-dotenv
- **Frontend**: HTML5, CSS3 (Vanilla CSS with Flexbox, CSS Grid, Custom properties), JavaScript (ES6+ Fetch API, DOM manipulation)
- **Icons**: FontAwesome v6
- **Typography**: Google Fonts (Outfit)
