from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import scraper

app = FastAPI()


# Allow requests from frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://v-find.vercel.app/",
        "https://vfind-317654718817.asia-south1.run.app/search",
        "https://vfind-monorepo.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # all HTTP methods allowed (GET, POST, etc.)
    allow_headers=["*"],  # all headers allowed
)


@app.post("/search")
async def req_similar_prod(request: Request):
    # Get image from request
    img = await request.json()
    img = img.get("image")
    res = scraper.search_similar_images(base64=img)
    print(res)
    if isinstance(res, list):
        links = []
        for item in res:
            prodId = item.get("id")
            link = scraper.getLinkFromDB(prodId)
            item["image"] = link
        return {"results": res}
    else:
        return {"error": "Unexpected response format"}
