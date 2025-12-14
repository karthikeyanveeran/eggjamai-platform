#!/bin/bash
echo "Starting application..."
echo "PORT: $PORT"
PORT=${PORT:-8000}
echo "Using PORT: $PORT"
exec uvicorn main:app --host 0.0.0.0 --port "$PORT"