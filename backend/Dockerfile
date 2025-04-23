# Use a slim Python base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app into the image
COPY . .

# Expose the port Flask will run on
EXPOSE 5001

# Run the app with gunicorn + eventlet
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "run:app", "--bind", "0.0.0.0:5001"]
