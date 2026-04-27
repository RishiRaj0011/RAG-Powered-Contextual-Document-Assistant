# RAG-Powered DSA Assistant
> Intelligent PDF document Q&A system with multilingual support and custom embeddings for Data Structures & Algorithms

## 🚀 Live Demo
Coming Soon

## 📌 Overview
This project solves the problem of quickly finding specific information from large technical documents. Built specifically for Data Structures & Algorithms content, it allows users to ask questions in both English and Hindi and get contextually accurate answers from indexed PDF documents using advanced RAG (Retrieval-Augmented Generation) architecture.

## ✨ Features
- 📄 **PDF Document Processing** - Automatically chunks and indexes PDF content with 1000-character segments and 200-character overlap
- 🔍 **Semantic Search** - Custom 768-dimensional embeddings with keyword boosting for DSA-specific terms
- 🌐 **Multilingual Support** - Handles queries in English and Hindi with intelligent translation
- 🤖 **Context-Aware AI Responses** - Google Gemini 2.0 Flash integration for accurate, document-based answers
- 💬 **Interactive Terminal Chat** - Real-time Q&A with conversation history
- ⚡ **Vector Similarity Search** - Pinecone-powered retrieval with top-10 results and relevance filtering
- 🎯 **Domain-Specific Optimization** - 40+ DSA keywords in English and Hindi for enhanced accuracy

## 🛠️ Tech Stack
| Category | Technology |
|---|---|
| **Backend** | Node.js, ES6 Modules |
| **AI/ML** | Google Gemini 2.0 Flash, Custom Embeddings (768-dim) |
| **Vector Database** | Pinecone |
| **Document Processing** | LangChain, PDF-Parse |
| **Environment** | dotenv, readline-sync |
| **Text Processing** | RecursiveCharacterTextSplitter |

## 📸 Screenshots
<img width="699" height="297" alt="Screenshot 2026-04-27 140519" src="https://github.com/user-attachments/assets/5d32bb31-efaa-4b78-92ca-02e0d3e0ced1" />
In this image as we can see we can ask any question related to the pdf we insterted in this case its about dsa so we can ask any question related to dsa i.e present in this pdf and if we ask question other than dsa then it will not answer and send a  message to ask relevant question 


## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- Google AI Studio API Key
- Pinecone Account & API Key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd RAG-Powered-Contextual-Document-Assistant-main

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys:
# GOOGLE_API_KEY=your_google_ai_key
# PINECONE_API_KEY=your_pinecone_key
# PINECONE_INDEX_NAME=your_index_name
```

### Setup Pinecone Index
1. Go to [Pinecone Console](https://app.pinecone.io)
2. Create new index with:
   - **Dimensions**: 768
   - **Metric**: cosine
   - **Name**: (match your PINECONE_INDEX_NAME)

### Run the Application
```bash
# Index your PDF document (run once)
npm run index

# Start the Q&A chat interface
npm run query
```

### Example Queries
```
Ask me anything --> What is quick sort?
Ask me anything --> merge sort ki time complexity kya hai?
Ask me anything --> Explain binary search algorithm
Ask me anything --> exit
```

## 🏗️ Architecture
The system follows a classic RAG pipeline with custom optimizations:

1. **Document Ingestion** (`index.js`) - PDF → Text Chunks → Custom Embeddings → Pinecone Storage
2. **Query Processing** (`query.js`) - User Input → Query Transformation → Vector Search → Context Retrieval
3. **Response Generation** - Retrieved Context + User Query → Gemini AI → Contextual Answer

**Key Design Decisions:**
- **Custom Embeddings**: Built domain-specific 768-dimensional vectors with keyword boosting instead of using generic models
- **Multilingual Query Transformation**: Preprocesses Hindi queries to improve English document retrieval
- **Conversation History**: Maintains chat context for follow-up questions
- **Concurrent Processing**: Pinecone operations with maxConcurrency: 5 for faster indexing

## 📈 Performance & Highlights
- **768-dimensional** custom embedding vectors with DSA keyword optimization
- **1000-character chunks** with 200-character overlap for optimal context preservation
- **Top-10 similarity search** with relevance filtering to prevent irrelevant responses
- **5x keyword boost** for matching DSA terms in both English and Hindi
- **Concurrent indexing** with 5 parallel operations for faster document processing
- **Real-time chat** with conversation history and graceful exit handling

## 🔮 Future Improvements
- Add support for multiple PDF documents simultaneously
- Implement web-based UI for better user experience
- Add more sophisticated embedding models (OpenAI, Sentence Transformers)
- Include citation tracking to show which document sections were used for answers
