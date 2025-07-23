## UI Walkthrough

## Landing Page

When the website loads, the **Chat** tool is selected by default.

- You can ask the model anything, and it will respond with a brief answer (typically around 160 words).

![Landing Page](media/images/landing-page.png)

For example, asking: Print hello world in C will result in:

![Chat Output](media/images/chat.png)

- You can continue chatting with the model by asking questions in the textarea below.
- The previous chats will be visible as you keep asking more questions, **as long as you don't change the tool**.

## Explain Code and Generate Tests

### File Sources for **Explain Code** and **Generate Tests** tools
To provide input to these tools, the files can be extracted from two different sources: 
1. Zopencommunity's GitHub Repositories - *Selected by default*
2. Local File System

Both tools use the same file selection interface. So we will demonstrate the following:
- Using the Explain Code tool on a file from GitHub.
- Generating tests for a file present on the local system.

### Explain Code Tool 
For this example, we have chosen the `cicd.groovy` file present in `llamacppport` of `zopencommunity`

![GitHub File Selection](media/images/github-file.png)

You can optionally highlight specific sections of the file. 

Here we have asked the model to explain the **stage('Build')** part of the code. 

After the **Submit** button is pressed, the file information is structured like this and the extracted code is given to the `llama-server` to generate a response.

![Formatted File Information](media/images/github-req.png)

The explanation is then shown: 

![Explain Code Output](media/images/explain-res.png)

To use the Explain Code tool again, press the `Start Over` button, which resets the form with **Zopencommunity GitHub** as the default source.

### Generate Tests Tool 
For this example, we have chosen a sample calculator file `calc.py` present on the `local system`. 

It contains four functions for **addition**, **subtraction**, **multiplication**, and **division**.

![Local File Selection](media/images/local-file.png)

On submission, the file and context are formatted as:

![Formatted File Information](media/images/local-req.png)

The generated test cases are displayed like this:

![Test Generation Output](media/images/generate-res.png)

### The file structure is explained in the `docs/STRUCTURE.md` file, and the documentation with steps for setup is in the `README.md`