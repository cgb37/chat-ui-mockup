# Use the official Python image as a base
FROM python:3.12-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Quart
RUN pip install --upgrade pip && pip install quart

# Copy project files
COPY . /app/

# Expose port 8000
EXPOSE 8000

# Command to run the Quart app
CMD ["python", "-m", "quart", "run", "--host=0.0.0.0", "--port=8000"]
