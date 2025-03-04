# Use a Python base image with Poetry pre-installed
FROM python:3.11-slim-buster

# Set the working directory
WORKDIR /app

# Copy poetry.lock and pyproject.toml
COPY pyproject.toml poetry.lock ./

# Install Poetry dependencies
RUN pip install poetry && poetry install --no-root --no-interaction

# Copy the application code
COPY . ./

# Expose the port your FastAPI app will run on
EXPOSE 8000

# Set the startup command using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]