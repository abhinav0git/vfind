# VFind 🔍

## Description

VisualFind is a web application that allows users to search for products using images. Upload an image to quickly find similar products online.

## Tech Stack 🌐

### Frontend

- Next.js, Tailwind CSS, shadcn/ui, Framer Motion

### Backend

- Python (FastAPI for backend), Pinecone (img to vector, vector search)
- MongoDB

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
