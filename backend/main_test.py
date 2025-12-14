from fastapi import FastAPI
import os

app = FastAPI(title="EggJam Test API")

@app.get("/")
def root():
    return {"message": "Test API working", "port": os.getenv("PORT", "8000")}

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main_test:app", host="0.0.0.0", port=port)