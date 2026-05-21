import React, { useState, useRef } from 'react';
import { Upload, Send, Bot, FileText, X, CheckCircle2 } from 'lucide-react';
import { uploadPDF, sendMessage } from './utils/chat';

const PdfRagChat = () => {
  const [message, setMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [fileName, setFileName] = useState('');
  const [documentId, setDocumentId] = useState(null);

  const [chats, setChats] = useState([
    {
      role: "bot",
      message:
        "Hello! Upload your PDFs above and I'll answer any questions about them."
    }
  ]);

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleUploadClick = () => {
    if (uploadStatus === 'idle') {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (
      selectedFile &&
      selectedFile.type === 'application/pdf'
    ) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      try {
        setUploadStatus('uploading');

        const docId = await uploadPDF(selectedFile);

        setDocumentId(docId);
        setUploadStatus('success');

      } catch (error) {
        console.error(error);
        setUploadStatus('idle');
      }
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();

    setUploadStatus('idle');
    setFileName('');
    setFile(null);
    setDocumentId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center py-16 px-4 font-sans">

      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-5xl font-bold text-[#1e293b] mb-4 tracking-tight"
          style={{ fontFamily: 'serif' }}
        >
          PDF RAG Chat
        </h1>

        <p className="text-slate-500 text-lg">
          Upload your PDFs and ask questions about them using AI
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={handleUploadClick}
        className={`w-full max-w-4xl bg-white border border-slate-300 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center transition-all relative mb-12
        ${
          uploadStatus === 'idle'
            ? 'hover:bg-slate-50 cursor-pointer'
            : 'cursor-default'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        {uploadStatus === 'idle' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#1e293b] mb-2">
              Drag and drop your PDFs here
            </h3>

            <p className="text-slate-400 text-sm mb-6">
              or{' '}
              <span className="text-blue-500 hover:underline">
                click to browse files
              </span>
            </p>

            <div className="bg-[#f1f5f9] px-6 py-2 rounded-full text-slate-400 text-xs font-medium">
              Supported formats: PDF
            </div>
          </>
        )}

        {uploadStatus === 'uploading' && (
          <div className="text-center">
            <p className="text-slate-700 font-medium">
              Uploading {fileName}...
            </p>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>

              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-4 border-white">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#1e293b] mb-1">
              {fileName}
            </h3>

            <button
              onClick={removeFile}
              className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-600 mt-2"
            >
              <X size={14} />
              Remove file
            </button>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="w-full max-w-4xl bg-white rounded-t-3xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">

        <div className="bg-[#007bff] p-4 flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>

          <span className="text-white font-bold text-sm">
            PDF Assistant
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[250px]">
          {chats.map((chat, id) => (
            <div
              key={id}
              className={`flex mb-3 ${
                chat.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {chat.role !== "user" && (
                <div className="bg-[#007bff] h-fit p-2 rounded-full mt-1 mr-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`px-5 py-3 rounded-2xl text-sm max-w-[75%] border
                ${
                  chat.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-[#f8fafc] text-slate-700 rounded-tl-none border-slate-100"
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 bg-[#f8fafc] px-4 py-3 rounded-xl text-sm outline-none border border-transparent focus:border-blue-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={uploadStatus !== 'success'}
          />

          <button
            disabled={
              uploadStatus !== 'success' ||
              !documentId
            }
            onClick={async () => {
              if (!message.trim()) return;

              setChats((prev) => [
                ...prev,
                { role: "user", message }
              ]);

              const currentMessage = message;
              setMessage("");

              try {
                const reply = await sendMessage(
                  documentId,
                  currentMessage
                );

                setChats((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    message: reply || "No response"
                  }
                ]);
              } catch (err) {
                setChats((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    message: "Error getting response"
                  }
                ]);
              }
            }}
            className={`px-4 py-2 rounded-xl text-white transition-colors
            ${
              uploadStatus === 'success'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfRagChat;