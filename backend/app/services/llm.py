from ollama import chat


SYSTEM_PROMPT = """
You are a document question-answering assistant.

Use ONLY the provided context to answer the question.

Rules:
- Answer using information from the context.
- If the answer is not present in the context, respond:
  "I could not find that information in the document."
- Do not make up facts.
- Keep answers concise and accurate.
- Do not explain the answers too much. Keep it straight to the point.
"""


def generate_response(context, question):
    print(context)
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": f"""
Context:
{context}

Question:
{question}
"""
        }
    ]

    stream = chat(
        model="llama3",
        messages=messages,
        stream=True
    )

    for chunk in stream:
        yield chunk["message"]["content"]