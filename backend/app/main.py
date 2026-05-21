from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import uuid

from app.services import document_retriever as dl
from app.services import llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    document_id = uuid.uuid4().hex

    file_path = os.path.join(
        UPLOAD_DIR,
        f"{document_id}_{file.filename}"
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document_text = dl.load_pdf(file_path)

    dl.store_embedding(
        document_text,
        {
            "id": document_id,
            "filename": file.filename
        }
    )

    return {
        "message": "Document indexed successfully",
        "document_id": document_id,
        "filename": file.filename
    }


@app.post("/chat")
async def chat(
    message: str = Form(...),
    document_id: str = Form(...)
):

    results = dl.retrieve(
    query=message,
    document_id=document_id
)

    context = " ".join(results["documents"][0])

    answer = llm.generate_response(
        context=context,
        question=message
    )
    return {
        "question": message,
        "answer": answer
    }