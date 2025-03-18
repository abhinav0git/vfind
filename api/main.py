from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import scraper

app = FastAPI()


# Allow requests from frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.post("/search")
async def req_similar_prod(request: Request):
    # Get image from request
    img = await request.json()
    img = img.get("image")
    res = scraper.search_similar_images(base64=img)
    print(res)
    if isinstance(res, list):
        return {"results": res}
    else:
        return {"error": "Unexpected response format"}
