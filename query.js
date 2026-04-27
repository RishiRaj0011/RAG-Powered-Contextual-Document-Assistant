import * as dotenv from 'dotenv';
dotenv.config();

import readlineSync from 'readline-sync';
import { SimpleEmbeddings } from './simple-embeddings.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const History = []

async function transformQuery(question){

History.push({
    role:'user',
    parts:[{text:question}]
    })  

const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You are a multilingual query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
    
    If the question is in Hindi (like "quick sort kya hota hai?"), translate key technical terms to English while keeping the query structure (example: "quick sort kya hota hai" becomes "what is quick sort").
    
    Only output the rewritten question and nothing else.
      `,
    },
 });
 
 History.pop()
 
 return response.text
}

async function chatting(question){
  //convert question into vector
  const queries = await transformQuery(question);
  const embeddings = new SimpleEmbeddings();
 //query embedding vector
 const queryVector = await embeddings.embedQuery(queries); 
 
 //make connection to pinecone database 
 const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  });

  if (!searchResults.matches.length) {
    console.log("\nNo relevant context found in the document.\n");
    return;
  }
    // console.log("Search Results: ",searchResults);

    //top-k results se context nikalna
    

    const context = searchResults.matches
                   .map(match => match.metadata.text)
                   .join("\n\n---\n\n");

    //context ko create karna hai LLM ke liye 

    //configuring Gemini model for Q&A

    History.push({
    role:'user',
    parts:[{text:queries}]
    })   


    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
    You will be given a context of relevant information and a user question.
    Your task is to answer the user's question based ONLY on the provided context.
    If the answer is not in the context, you must say "I could not find the answer in the provided document."
    Keep your answers clear, concise, and educational.
      
      Context: ${context}
      `,
    },
   });


   History.push({
    role:'model',
    parts:[{text:response.text}]
  })

  console.log("\n");
  console.log(response.text);
}


async function main() {
  console.log('\nDSA Assistant ready! Type "exit" to quit.\n');
  while (true) {
    const userProblem = readlineSync.question('Ask me anything --> ');
    if (userProblem.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      process.exit(0);
    }
    await chatting(userProblem);
  }
}


main();