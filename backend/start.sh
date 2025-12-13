#!/bin/bash
echo "Starting application..."
echo "PORT: $PORT"
uvicorn main_railway:app --host 0.0.0.0 --port ${PORT:-8000}