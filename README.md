# Mini Project Classifier

A React-based chatbot application that analyzes websites using Google's Gemini AI to provide interactive content exploration and user intent classification.

## Project Overview

This chatbot application helps users explore website content through an interactive chat interface. Users can input any website URL, and the system will analyze the content to provide relevant options for exploration. The chatbot uses Google's Gemini AI to generate context-aware responses and classifications.

## Features

- **Website Analysis**: Instant analysis of any website URL
- **AI-Powered Classification**: Uses Gemini AI for intelligent content categorization
- **Interactive Chat Interface**: User-friendly chat-based interactions
- **Multiple-Choice Options**: AI-generated categorized options (A-D format)
- **Real-time Feedback**: Loading states and notifications
- **New Chat Function**: Easy reset for new website analysis
- **Error Handling**: Graceful error management with user notifications

## Tech Stack

### Frontend
- React
- Redux Toolkit (State Management)
- Framer Motion (Animations)
- React Hot Toast (Notifications)
- Lucide React (Icons)
- TailwindCSS (Styling)

### Backend
- Python
- Flask
- Google Gemini AI
- Beautiful Soup 4 (Web Scraping)
- CORS handling

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/RickCheungCL/Mini_Project_Classifier.git
cd Mini_Project_Classifier
```

2. Set up the backend:
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

4. Set up the frontend:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```
The backend will run on `http://localhost:5000`

2. Start the frontend:
```bash
cd frontend
npm start
```
Access the application at `http://localhost:3000`

## Usage Guide

1. Start the application
2. Enter a website URL in the chat interface (e.g., "apple.com")
3. Wait for the AI to analyze the website
4. Select from the provided A-D options or type your own query
5. Continue the conversation to explore the website content
6. Use "New Chat" to start a fresh analysis

## Key Components

### Frontend
- `VisitorClassifier.js`: Main chat interface component
- `chatSlice.js`: Redux state management
- `store.js`: Redux store configuration

### Backend
- `app.py`: Flask server and API endpoints
- Web scraping functionality
- Gemini AI integration
- Response generation

## Requirements

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Gemini API key
- npm/pip package managers

## Contributing

Feel free to open issues or submit pull requests for any improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for powering the analysis
- React and Flask communities
- All contributors and maintainers

## Contact

Rick Cheung - [GitHub Profile](https://github.com/RickCheungCL)

Project Link: [https://github.com/RickCheungCL/Mini_Project_Classifier](https://github.com/RickCheungCL/Mini_Project_Classifier)
