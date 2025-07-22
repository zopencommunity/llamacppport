from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os

# app = Flask(__name__, static_folder='static', template_folder='template')
app = Flask(__name__)
CORS(app)

LLAMA_SERVER_URL = "http://127.0.0.1:21099/completion"

'''
@app.route('/')
def home():
    return render_template('index.html')
'''

# helper function to call LLM
def call(prompt: str) -> str:
    payload = {
        "prompt": prompt,
        "temperature": 0.1,
        "repeat_penalty": 1.1,
        "stop": ["</s>"]
    }
    try:
        res = requests.post(LLAMA_SERVER_URL, json=payload)
        res.raise_for_status()
        return res.json().get("content", "").strip()
    except Exception as e:
        return f"Error: {str(e)}"


@app.route("/tools/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")
    prompt = f"Answer the question or prompt given in around 160 words. \n\nQuestion: {message}\n\nAnswer:"
    response = call(prompt)
    return jsonify({"response": response})


@app.route("/tools/explain", methods=["POST"])
def explain():
    data = request.json

    file = data.get("file")
    repo = data.get("repo")
    org = data.get("org")
    prompt = data.get("question")
    file_path = data.get("file_path")

    if repo:
        from access_github import get_file_info
        context = get_file_info(file, repo, org)
        file_desc = f"{file} in {repo} of {org}"
    else:
        try:
            with open(file_path, 'r') as f:
                context = f.read()
            file_desc = f"local file {file_path}"
        except Exception as e:
            return jsonify({"response": f"Could not read file: {e}"})

    if "Exception: Could not fetch" in context:
        return jsonify({"response": context})

    full_prompt = f"""
        explain the following code line wise and in short with respect to the context {file_desc} and the prompt given by the user.

        content (the code) of the file:
        {context}

        Prompt: {prompt}

        explanation:
    """
    # print(full_prompt)
    return jsonify({"response": call(full_prompt)})


@app.route("/tools/tests", methods=["POST"])
def generate_tests():
    data = request.json
    prompt = data.get("question")
    file = data.get("file")
    repo = data.get("repo")
    org = data.get("org")
    file_path = data.get("file_path")

    if repo:
        from access_github import get_file_info
        context = get_file_info(file, repo, org)
        file_desc = f"file {file} in {repo} or {org}"
    else:
        try:
            with open(file_path, 'r') as f:
                context = f.read()
            file = os.path.basename(file_path)
            file_desc = f"local file {file_path}"
        except Exception as e:
            return jsonify({"response": f"Could not read file: {e}"})

    if "Could not fetch" in context:
        return jsonify({"response": context})

    file_ext = file.split('.')[-1]

    full_prompt = f"""
        Write a .{file_ext} unit test code file to test the contents of {file_desc} along with a shell script (.sh) to execute the test file in accordance to the prompt given by the user.

        - Give the final shell script file ONLY that executes the .{file_ext} test code as output with no comments or explanations.
        - Use meaningful test cases for the functions and classes defined in {file}.
        - Keep the test file self-contained and executable.
        - Assume that the code's functions and classes can be imported externally like this `from {file} import <function>`.
        - Do not print the contents of the file

        content of the file:
        {context}

        Prompt: {prompt}

        Generated test case code file (in the format: test_file ...):
    """
    # print(full_prompt)
    return jsonify({"response": call(full_prompt)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=21098, debug=True)