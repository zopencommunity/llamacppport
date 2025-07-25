# zOpen Chat

## Description
**zOpen Chat** is a web-based interface that enables natural language interaction with AI models (like LLaMA 3.2 and Granite 3), designed to explore and work with open-source tools in the z/OS ecosystem.

This project features:
- A **web-based interface** for natural interactions.
- Integration with **llamacpp** backend for inferencing.
- Built-in tools to **search GitHub repositories** relevant to z/OS and files present in the **local file system**.

## Use cases covered
1. **Chat**: A conversational Q&A system where users can ask questions and receive clear, concise answers.
2. **Explain Code**: Request short, contextual explanations for specific code files or components.
3. **Generate Tests**: Ask the system to generate unit tests or test cases for specific files using natural language prompts.

The files can be extracted from the repositories in `zopencommunity` or the `local file system`.
> For usage examples and UI walkthroughs, see `docs/WEBUI.md`
<!-- > Video Demonstration in `docs/videos/Final Use Cases Demo.mp4` -->

## Prerequisites

Before running zOpen Chat, ensure that the following are set up:
- **llamacpp**: from the llamacpp port of z/OS. [Repository Link](https://github.com/zopencommunity/llamacppport)
- **Node.js (LTS)**: [Download Node.js supported by z/OS](https://www.ibm.com/products/sdk-nodejs-compiler-zos)
- **npm**: Comes with Node.js

## Workflow

The **Model Context Protocol (MCP)** is implemented here to orchestrate the routing in this system. It handles user inputs, tool management, and communication between the client interface and the underlying LLM infrastructure.

- The client UI allows users to interact with the system via options like:
    - Chat
    - Explain Code
    - Generate Test Cases

- These requests are sent to the MCP Server, which serves as the orchestrator.

- The MCP Server forwards the request to a Llama Server hosting the Large Language Model (LLM).

- The LLM processes the input and returns a response to the MCP Server.

- The response is routed back to the client UI, completing the workflow loop.

> Folder structure details are explained in `docs/STRUCTURE.md`

![Workflow](docs/images/workflow.png)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/zopencommunity/llamacppport.git
cd examples
```

### 2. Run LLaMA Inference Server
Before starting any other servers, make sure the `llama-server` is running in the background.
```bash
llama-server -m /data/work/ai/models/granite-3.0-1b-a400m-instruct-be.Q4_K_M.gguf \
             --host 127.0.0.1 \
             --port 21099 \
             --no-mmap \
             --threads 1 \
             -v
```
This command starts the LLaMA inference engine. Let it run in the background.

### 3. Python Backend
Create a virtual environment and activate it
```bash
python -m venv venv
source venv/bin/activate
```

Install the dependencies
``` bash
cd backend
pip install -r requirements.txt
```

Once the dependencies are installed run the Flask app
```bash
python app.py
```
This will start the Flask server on `http://127.0.0.1:21098`. To change the port, update the relevant port configuration in the `frontend/src/config.js` code.

### 4. Frontend (Website)
Install the node modules
```bash
cd frontend
npm install
```

Start the website
```bash
npm start
```
The website can be accessed by going to `http://127.0.0.1:21097` on your web browser!