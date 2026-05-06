import React, { useState, useRef } from 'react';
import { Upload, MessageSquare, Send, Bot, FileText, X, CheckCircle2 } from 'lucide-react';

const PdfRagChat = () => {
  const [message, setMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (uploadStatus === 'idle') {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setUploadStatus('idle');
    setFileName('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center pt-16 px-4 font-sans">

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-[#1e293b] mb-4 tracking-tight" style={{ fontFamily: 'serif' }}>
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
          ${uploadStatus === 'idle' ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'}`}
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
            <h3 className="text-2xl font-bold text-[#1e293b] mb-2">Drag and drop your PDFs here</h3>
            <p className="text-slate-400 text-sm mb-6">
              or <span className="text-blue-500 hover:underline">click to browse files</span>
            </p>
            <div className="bg-[#f1f5f9] px-6 py-2 rounded-full text-slate-400 text-xs font-medium">
              Supported formats: PDF (Max 50MB per file)
            </div>
          </>
        )}

        {uploadStatus === 'uploading' && (
          <div className="w-full max-w-md text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Uploading {fileName}...</span>
              <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="relative mb-4">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-4 border-white">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-1">{fileName}</h3>
            <button
              onClick={removeFile}
              className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-600 mt-2"
            >
              <X size={14} /> Remove file
            </button>
          </div>
        )}
      </div>

      {/* Integrated Chat Section */}
      <div className="w-full max-w-4xl bg-white rounded-t-3xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
        <div className="bg-[#007bff] p-4 flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">PDF Assistant</span>
        </div>

        <div className="flex-1 p-6 bg-white overflow-y-auto min-h-[250px]">
          <div className="flex items-start gap-3">
            <div className="bg-[#007bff] p-2 rounded-full mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[#f8fafc] px-5 py-3 rounded-2xl rounded-tl-none border border-slate-100 text-slate-700 text-sm max-w-[80%]">
              {uploadStatus === 'success'
                ? `I've processed "${fileName}". What would you like to know about it?`
                : "Hello! Upload your PDFs above and I'll answer any questions about them."}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 bg-[#f8fafc] px-4 py-3 rounded-xl text-sm outline-none border border-transparent focus:border-blue-200 transition-all"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={uploadStatus !== 'success'}
          />
          <button
            disabled={uploadStatus !== 'success'}
            className={`px-4 py-2 rounded-xl text-white transition-colors ${uploadStatus === 'success' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfRagChat;