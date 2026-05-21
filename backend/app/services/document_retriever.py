import pypdf
import chromadb
from ollama import embeddings

client = chromadb.Client()

collection = client.get_or_create_collection(
    name="pdf_embeddings"
)


def load_pdf(file_path):
    pdf = pypdf.PdfReader(file_path)

    text = ""

    for page in pdf.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text

    return text


def chunk_text(text, chunk_size=600, overlap=150):
    """
    Splits text on clean word boundaries with a protective
    overlap to preserve context between chunks.
    """

    words = text.split()
    chunks = []

    i = 0

    while i < len(words):

        chunk_words = words[i:i + chunk_size]

        if not chunk_words:
            break

        chunks.append(" ".join(chunk_words))

        i += (chunk_size - overlap)

    return chunks


def embeddings_from_text(text):

    response = embeddings(
        model="nomic-embed-text",
        prompt=text
    )

    return response["embedding"]


def store_embedding(text, metadata):

    chunks = chunk_text(text)

    for index, chunk in enumerate(chunks):

        embedding = embeddings_from_text(chunk)

        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            metadatas=[
                {
                    "document_id": metadata["id"],
                    "filename": metadata["filename"]
                }
            ],
            ids=[f'{metadata["id"]}_{index}']
        )


def retrieve(query, document_id, top_k=3):

    query_embedding = embeddings_from_text(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={
            "document_id": document_id
        }
    )

    return results