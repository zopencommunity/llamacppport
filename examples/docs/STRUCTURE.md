# Project Folder Structure

This document explains the folder structure of the zOpen Chat project and what each major component contains.

## **Base Directory**
- `README.md`: Main project documentation.

- `docs/`: Contains additional documentation files and screenshots.
  - `WEBUI.md`: Frontend screenshots, component flow, UI explanation.
  - `STRUCTURE.md`: This file.
  - `images/`: All images referenced in the docs.

- `backend/`
- `frontend/`

## **Backend**
Python Flask server that powers the AI and file system APIs.
- `access_github.py`: Extracts code from GitHub files
- `app.py`: Backend server with all tools implemented.
- `requirements.txt`: Python dependencies.

## **Frontend**
React-based frontend for user interaction.
- `public/`: index.html and logo.

- `src/`: Source code for the web UI.
  - `components/`: React components for different parts of the website
    - `Header.js`: Welcome part of the page
    - `Tools.js`: Enables tool selection using buttons
    - `ChatMode.js`: Code to implement an interactive chat inferface
    - `CodeMode.js`: Handles **Explain Code** and **Generate Tests** tools
    - `utils.js`: Converts markdown to HTML
  - `config.js`: Contains the URL to the Flask app's API endpoint
  - `App.js`: Main tool setting logic.
  - `index.js`: Entry point of the React app.

- `package.json`: NPM scripts and dependencies for frontend. Environment variables are set according to the public facing z/OS system.

### The Web UI Walkthroughs are in the WEBUI.md file