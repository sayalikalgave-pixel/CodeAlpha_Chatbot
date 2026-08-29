# 🤖 CodeAlpha AI Chatbot

An AI-powered chatbot web application developed as part of the **CodeAlpha Internship – Cloud Computing Tasks**.

The chatbot provides an interactive ChatGPT-style interface where users can ask questions and receive AI-generated responses. It also supports image/file uploads, recent chat history, and light/dark mode.

## ✨ Features

* 🤖 AI-powered conversational chatbot
* 💬 Real-time question and answer interaction
* 🧠 Generative AI responses using Google Gemini
* 📎 Image/file attachment support
* 🖼️ Image analysis with text prompts
* 🕘 Recent chat history using browser local storage
* 🌙 Dark Mode / ☀️ Light Mode
* ➕ New Chat functionality
* 💭 Thinking/loading animation
* 📱 Responsive web interface
* 🔐 API key stored securely using `.env`

## 🛠️ Technologies Used

* **Python**
* **Flask**
* **HTML5**
* **CSS3**
* **JavaScript**
* **Google Gemini API**
* **python-dotenv**
* **Git & GitHub**

## 📁 Project Structure

```text
CodeAlpha_Chatbot/
│
├── app.py
├── .gitignore
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
└── README.md
```

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/sayalikalgave-pixel/CodeAlpha_Chatbot.git
```

### 2. Open the project

```bash
cd CodeAlpha_Chatbot
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

**Windows:**

```bash
venv\Scripts\activate
```

### 5. Install required packages

```bash
pip install flask python-dotenv google-genai
```

### 6. Create the `.env` file

Create a file named:

```text
.env
```

Add your Gemini API key:

```text
GEMINI_API_KEY=your_api_key_here
```

**Never upload your `.env` file or expose your API key publicly.**

### 7. Run the application

```bash
python app.py
```

Open the application in your browser at:

```text
http://127.0.0.1:5000
```

## 🔒 Security

The Gemini API key is stored in an environment variable rather than directly inside the source code.

The `.gitignore` file prevents sensitive files such as `.env` and the Python virtual environment from being uploaded to GitHub.

## 🎯 Internship Task

This project fulfills the **CodeAlpha Cloud Computing – Task 4: Making a Chatbot** requirement by implementing an AI-powered generative chatbot integrated into a web interface.

## 👩‍💻 Author

**Sayali Kalgave**

Developed as part of the **CodeAlpha Internship Program**.

## ⚠️ Disclaimer

CodeAlpha AI can make mistakes. Important information should be verified from reliable sources.
