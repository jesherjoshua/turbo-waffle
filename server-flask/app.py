import base64
from flask import Flask, request, jsonify
import psycopg2
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
import requests

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Database connection parameters
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_database = os.getenv("DB_DATABASE")
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
endpoint = os.getenv("ENDPOINT")


@app.route('/health')
def health():
    return 'OK'

@app.route('/check-url', methods=['POST'])
def check_url():
    # Get the URL from the request
    url = request.json.get('url')
    userId = request.json.get('userId')
    print(userId) 

    # Remove "http://" or "https://" from the URL
    url = urlparse(url).netloc

    # Connect to the PostgreSQL database 
    conn = psycopg2.connect(host=db_host, port=db_port, dbname=db_database, user=db_username, password=db_password)

    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    # Execute the query to check if the URL exists in the database
    query = "SELECT * FROM sites WHERE domain = %s OR domain = %s OR domain LIKE %s"
    cursor.execute(query, (url, "www." + url, "%" + url + "%"))
    row = cursor.fetchone()

    # Close the cursor and database connection
    cursor.close()
    conn.close()

    if row:
        # Convert the row to a dictionary with column names
        columns = [desc[0] for desc in cursor.description]
        row_dict = dict(zip(columns, row))
        print(row_dict)
        # URL exists in the database, return True and the row as a dictionary
        return jsonify({'exists': True, 'row': row_dict, 'url': url})
    else:
        # URL does not exist in the database, return False
        return jsonify({'exists': False, 'url': url})
    
@app.route('/check-adblocker', methods=['POST'])
def check_adblocker():
    # Get the URL from the request
    url = request.json.get('url')

    # Filter the URL based on the subdomain
    parsed_url = urlparse(url)
    subdomain = parsed_url.hostname.split('.')[0]

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(host=db_host, port=db_port, dbname=db_database, user=db_username, password=db_password)

    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    # Execute the query to check if the URL exists in the database
    cursor.execute("SELECT * FROM adblocker WHERE link = %s", (url,))
    row = cursor.fetchone()

    # Close the cursor and database connection
    cursor.close()
    conn.close()

    if row:
        # Convert the row to a dictionary with column names
        columns = [desc[0] for desc in cursor.description]
        row_dict = dict(zip(columns, row))

        # URL exists in the database, return True and the row as a dictionary
        return jsonify({'exists': True, 'row': row_dict, 'subdomain': subdomain})
    else:
        # URL does not exist in the database, return False
        return jsonify({'exists': False, 'subdomain': subdomain})

@app.route('/false-urgency', methods=['POST'])
def false_urgency():
    # Get the URL from the request 
    text = request.json.get('text')
    url = request.json.get('url')
    
    # TODO: To add queue for processing
    response = requests.post(endpoint+'/process_json', json={"url":url,"text": text})
    response_json = response.json()
    return jsonify({'status': "Uploaded", 'response': response_json})

@app.route('/screenshot', methods=['POST'])
def screenshot():
    # Get the base64 image data from the request
    imgData = request.json.get('imgData')
    imgDataStr = str(imgData)

    # Remove the data URL prefix
    imgData = imgData.replace("data:image/png;base64,", "")

    # Convert the base64 image data to bytes
    image_bytes = base64.b64decode(imgData)

    # Create the images directory if it doesn't exist
    if not os.path.exists('images'):
        os.makedirs('images')

    # Save the image as a PNG file
    with open('images/image.png', 'wb') as file:
        file.write(image_bytes)
 
    # TODO: To add queue for processing
    try:
        response = requests.post(endpoint+'/process_screenshot', json={"image_string":imgDataStr})
        return jsonify({'status': "Uploaded", 'response': response.json()}), 200
    except:
        return jsonify({'status': "Uploaded", 'response': "Error"}), 500
  
@app.route('/chat-bot', methods=['POST'])
def chat_bot(): 
    # Get the base64 image data from the request
    message = request.json.get('message')
    userId = request.json.get('userId')
    mimetype = request.json.get('mimetype')
    # print(userId, message['message'], message['image']) 

    if mimetype == "text_prompt":
        modifiedJSON = {
        "prompt_type":mimetype,
        "chat_history":{
        "contents": [
            {
                "role":"user",
                "parts":[{
            "text":"YOU ARE A AI ASSISTANT FOR MY BROWSER EXTENSION CALLED OFF-DARK. ANSWER ONLY DARK PATTERN REGARDED QUESTIONS. DONT EXCEED MORE THAN 20 WORDS"
            }]
            },    
            {
            "role":"model",
            "parts":[
            {
                "text":""
            }] 
        },
            {
                "role":"user",
                "parts":[{
            "text":message
            }]
            }
            ]}
        }
    elif mimetype == "image_prompt":
        modifiedJSON = {
        "prompt_type":mimetype,
        "chat_history":{
        "contents": [
           
            {
                "role":"user",
                "parts":[{
                "text":message['message']
                }, 
            {
                "inline_data": {
                "mime_type": "image/jpeg",
                "data": message['image'].replace("data:image/png;base64,", "")
                }}]
            }
            ]}
        }
    
    response = requests.post(endpoint+'/chatbot', json=modifiedJSON)
    response = response.json()
    print("Request", modifiedJSON)     
    return jsonify({'status': "Uploaded", 'response': response['Answer']}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
  