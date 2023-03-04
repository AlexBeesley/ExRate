# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port that the Python application will listen on
EXPOSE 8000

# Start the Python application with arguments
CMD ["python", "Program.py", "--base", "USD", "--target", "EUR"]
