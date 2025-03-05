FROM python:3.11-slim-buster

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN pip install poetry --no-cache-dir poetry==1.8.5

RUN poetry config virtualenvs.create false

RUN poetry install --no-root --no-interaction

RUN poetry shell

COPY . .

EXPOSE 8000

ENV DATABASE_NAME=${DATABASE_NAME} \
  TOKEN_SECRET_KEY=${TOKEN_SECRET_KEY} \
  TOKEN_EXPIRATION_MINUTES=${TOKEN_EXPIRATION_MINUTES}\
  REFRESH_TOKEN_EXPIRATION_MINUTES=${REFRESH_TOKEN_EXPIRATION_MINUTES} \
  OTP_SECRET_KEY=${OTP_SECRET_KEY} \  
  OTP_ISSUER_NAME=${OTP_ISSUER_NAME} 

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]