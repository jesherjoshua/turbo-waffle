# Dark Pattern Detecting Chrome Extension

This Chrome extension, powered by Flask, PyTorch, HTML, CSS, and JavaScript, aims to detect and highlight dark patterns on websites. Dark patterns are user interface designs crafted to trick users into taking actions they might not want to, often in ways that are deceptive or manipulative.

## Features

- **Real-time Detection**: Detects dark patterns as users browse websites.
- **Highlighting**: Highlights suspected dark patterns to draw users' attention.
- **Customizable Models**: Users can fine-tune or switch between different detection models using the provided notebook.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/dark-pattern-extension.git
    ```

2. Install dependencies for the Flask server:

    ```bash
    cd dark-pattern-extension/server-flask
    pip install -r requirements.txt
    ```

3. Install the Chrome extension:

    - Open Chrome and go to `chrome://extensions/`
    - Enable Developer Mode (toggle switch at the top right)
    - Click on "Load unpacked" and select the `dark-pattern-extension/chrome-extension` directory.

## Usage

1. Start the Flask server:

    ```bash
    cd dark-pattern-extension/server-flask
    python app.py
    ```

2. Open Chrome and browse websites as usual. The extension will highlight suspected dark patterns on the page.

## Customization and Model Training

1. **Customizing Models**: Users can fine-tune or switch between different detection models by modifying the notebook in the `dark-pattern-extension/finetune` directory. Simply change the model name to your preferred model and follow the instructions in the notebook.

## Directory Structure

- **server-flask**: Contains the Flask server code for real-time dark pattern detection.
- **figures**: Contains result comparison graphs of various models.
- **chrome-extension**: Contains the Chrome extension code for detecting and highlighting dark patterns.
- **finetune**: Includes a notebook for fine-tuning or training custom models on datasets.

## Contributors

- Sree Dananjay
- Jesher Joshua M

## License

This project is licensed under the unlicense - see the [LICENSE](LICENSE) file for details.
