# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and .env file
COPY requirements.txt .env ./

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app code
COPY . .

# Expose the port the app will run on
EXPOSE 5000

# Load environment variables from the .env file
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
RUN apt-get update && apt-get install -y gcc
RUN pip install python-dotenv

# Run the Flask app
CMD ["python", "app.py"]