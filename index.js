import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { SimpleEmbeddings } from './simple-embeddings.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';  

async function indexDocument(){
  
const PDF_PATH = './Dsa.pdf';
const pdfLoader = new PDFLoader(PDF_PATH);
const rawDocs = await pdfLoader.load();

// Chunking the document into smaller pieces
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

//vector store and embedding model code goes here

const embeddings = new SimpleEmbeddings();

  // Test embedding to verify it works
  console.log('Testing embedding...');
  const testEmbedding = await embeddings.embedQuery('test');
  console.log('Embedding dimension:', testEmbedding.length);

  // database configuration and storing vectors code goes here
  //intialize pinecone client
  
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  //langchain integration with pinecone(chunkinged docs and embeddings with database)

  await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
}

indexDocument()
  .then(() => console.log('✅ Indexing complete! You can now run: npm run query'))
  .catch(err => { console.error('❌ Indexing failed:', err.message); process.exit(1); });