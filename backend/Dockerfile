FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "-c", "import uvicorn; import os; print(f'Starting on port {os.getenv(\"PORT\", 8000)}'); uvicorn.run('main:app', host='0.0.0.0', port=int(os.getenv('PORT', 8000)))"]