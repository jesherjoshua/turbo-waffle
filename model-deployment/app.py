from flask import Flask, request, jsonify
import torch
import numpy as np
from transformers import BertTokenizerFast, BertForSequenceClassification
from gemini_comm.text_prompt import text_prompt_llm
from gemini_comm.image_prompt import image_prompt_llm
from gemini_comm.chatbot_prompting import chatbot_prompt_llm

app = Flask(__name__)


class DarkPatternDetector:
    """
    Class for detecting dark patterns in text using a pre-trained BERT model.
    """

    def __init__(self):
        """
        Initializes the DarkPatternDetector class.

        This method loads the pre-trained BERT model, tokenizer, and class labels.
        """
        self.model = BertForSequenceClassification.from_pretrained(
            "./weights/multi-class"
        )
        self.tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
        self.class_labels = [
            "confirm_shaming",
            "disguised_ads",
            "false_urgency",
            "forced_action",
            "not dark pattern",
            "rogue_malware",
            "sneaky_subscriptions",
            "trick_questions",
        ]

    def detect_dark_pattern_batch(self, texts):
        """
        Detects dark patterns in a batch of texts.

        Args:
            texts (list): A list of texts to be analyzed.

        Returns:
            tuple: A tuple containing the predicted classes and their corresponding probabilities.
        """
        inputs = self.tokenizer(
            texts, padding=True, truncation=True, return_tensors="pt"
        )
        outputs = self.model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predictions = predictions.cpu().detach().numpy()

        predicted_classes = np.argmax(predictions, axis=1)
        probabilities = predictions[
            np.arange(len(predicted_classes)), predicted_classes
        ]

        return predicted_classes, probabilities


@app.route("/process_json", methods=["POST"])
def process_json():
    """
    Process JSON data containing text and URL information.
    
    Returns:
        A JSON response containing the processed data, including dark strings, 
        the number of dark patterns found, a Gemini summary, and the URL.
    """
    try:
        data = request.get_json()
        print(data)
        text_array = (
            data["text"][0].split("\n") if len(data["text"]) == 1 else data["text"]
        )
        url = data["url"]

        dark_detector = DarkPatternDetector()

        # Skip single-word texts
        text_array = [
            single_text for single_text in text_array if len(single_text.split()) > 1
        ]

        if not text_array:
            return jsonify({"message": "No eligible texts for processing."}), 200

        batch_size = 8  # Adjust the batch size based on your GPU memory constraints
        dark_strings = []

        for i in range(0, len(text_array), batch_size):
            batch_texts = text_array[i : i + batch_size]
            predicted_classes, probabilities = dark_detector.detect_dark_pattern_batch(
                batch_texts
            )

            for j in range(len(predicted_classes)):
                predicted_class = predicted_classes[j]
                probability = probabilities[j]

                if predicted_class != 4 and probability > 0.8:
                    if predicted_class == 1 and len(batch_texts[j].split()) < 3:
                        continue

                    dark_strings.append(
                        {
                            "text": batch_texts[j],
                            "class": dark_detector.class_labels[predicted_class],
                            "probability": str(probability),
                        }
                    )

        # Sort dark strings by highest probability
        dark_strings = sorted(
            dark_strings, key=lambda x: float(x["probability"]), reverse=True
        )[: len(dark_strings) if len(dark_strings) < 25 else 25]
        gemini_summary = text_prompt_llm(str(dark_strings))
        result = {
            "message": "JSON processed successfully",
            "dark_strings": dark_strings,
            "Number of dark patterns": str(len(dark_strings)),
            "gemini_summary": gemini_summary,
            "url": url,
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/process_screenshot", methods=["POST"])
def process_screenshot():
    """
    Process the screenshot received in the request.

    Returns:
        A JSON response containing the message and the processed image result.
    """
    try:
        data = request.get_json()
        image_string = data["image_string"]
        image_result = image_prompt_llm(image_string)
        result = {
            "message": "Image processed successfully",
            "image_result": image_result,
        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/chatbot", methods=["POST"])
def chatbot():
    """
    Function that handles the chatbot logic.

    Returns:
        JSON response: The response generated by the chatbot.
    """
    try:
        data_request = request.get_json()
        user_prompt = data_request.get("chat_history")["contents"]
        print(user_prompt)
        prompt_type = data_request.get("prompt_type")
        return jsonify(chatbot_prompt_llm(user_prompt, prompt_type)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=8000)
