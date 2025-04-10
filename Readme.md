# VFind 🔍

## Description

VisualFind is a web application that allows users to search for products using images. Upload an image to quickly find similar products online.

## Tech Stack 🌐

### Frontend

- Next.js, Tailwind CSS, shadcn/ui, Framer Motion

### Backend

- Python (FastAPI for backend), Pinecone (img to vector, vector search)
- MongoDB (for storing product data)
- PostHog (for web analytics)

## Local Setup 💻

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/abhinav0git/product-search-landing
    cd product-search-landing
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

4.  **Set up the backend:**
    - Navigate to the `api`.
    - Install the python dependencies
      ```bash
      pip install -r requirements.txt
      ```
    - Run the backend server
      ```bash
      uvicorn main:app --reload
      ```

## Demo

<div>
    <a href="https://www.loom.com/share/f7173cbfa4784cb3ac08b5bad9c06149">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/f7173cbfa4784cb3ac08b5bad9c06149-006c82301d6ec30d-full-play.gif">
      <a href="https://www.loom.com/share/f7173cbfa4784cb3ac08b5bad9c06149">
      <p>VFind - Visual Search Engine - Google Chrome - 21 March 2025 - Watch Video</p>
    </a>
    </a>
  </div>

## ToDo

- [x] add signup and login functionality
- [ ] backend API isnt secure, API endpoint can be retreived via dev tools (anyone could use API directly), api route must be implemented
- [ ] 10 similar results or something like that (if user is signedup)
- [ ] full body fit recommendation (if user is signedup)
- [ ] "not so accurate but ok-ish" vton for uploaded image or any other similar image from result (if user is signedup)
- [ ] browser extention (if user is signedup)(only top 3 similarsearch result)
