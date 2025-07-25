import requests
import base64
import dotenv
import os
import re

dotenv.load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    raise Exception("Set your GitHub Token from https://github.com/settings/tokens")

def parse_input(prompt):
    match = re.search("explain\s+(.*?)\s+(from|of|in)\s+([^\s]+)", prompt)
    if match:
        file, _, repo = match.groups()
        return file.strip(), repo.strip()

    return "Malformed prompt received. Please give the correct prompt."

def get_file_info(file, repo, org='zopencommunity'):
    api_url = f"https://api.github.com/repos/{org}/{repo}/contents/{file}"
    headers = {"Authentication": GITHUB_TOKEN}
    try:
        res = requests.get(api_url, headers=headers)
        res.raise_for_status()
        data= res.json()
        if data.get("encoding") == "base64":
            return base64.b64decode(data["content"]).decode('utf-8', errors='ignore')
        return data.get("content","")
    except Exception as e:
        return f"Exception: Could not fetch {file} from {repo} \n{e}"