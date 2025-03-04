# Use a Python base image with Poetry pre-installed
FROM python:3.11-slim-buster

# Set the working directory
WORKDIR /app

# Copy poetry.lock and pyproject.toml
COPY pyproject.toml poetry.lock ./

# Install Poetry dependencies
RUN pip install poetry --no-cache-dir poetry==1.8.5

# config poetry
RUN poetry config virtualenvs.create false

# Install project dependencies
RUN poetry install --no-root --no-interaction

RUN poetry shell

# Copy the application code
COPY . .

# Expose the port your FastAPI app will run on
EXPOSE 8000

ENV DATABASE_NAME=${DATABASE_NAME} \
  TOKEN_SECRET_KEY=${TOKEN_SECRET_KEY} \
  TOKEN_EXPIRATION_MINUTES=${TOKEN_EXPIRATION_MINUTES}\
  REFRESH_TOKEN_EXPIRATION_MINUTES=${REFRESH_TOKEN_EXPIRATION_MINUTES} \
  OTP_SECRET_KEY=${OTP_SECRET_KEY} \  
  OTP_ISSUER_NAME=${OTP_ISSUER_NAME} 

# Set the startup command using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]