export async function uploadPDF(file) {
    const formData = new FormData();

    formData.append("file", file);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        return data.document_id;

    } catch (error) {
        console.error("Upload error:", error);
    }
}

export async function sendMessage(documentId, message) {
    const formData = new FormData();

    formData.append("document_id", documentId);
    formData.append("message", message);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        return data.answer;

    } catch (error) {
        console.error("Chat error:", error);
    }
}