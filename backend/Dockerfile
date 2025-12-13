FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main_railway.py .

CMD ["uvicorn", "main_railway:app", "--host", "0.0.0.0", "--port", "8000"]