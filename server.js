import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";

console.log(process.env.SBProjectURL);
// Initialize our Supabase client
const supabaseClient = createClient(
  process.env.SBProjectURL,
  process.env.SPTokenKey,
  { auth: { persistSession: false } }
);

// generateEmbeddings
async function generateEmbeddings() {
  // Initialize OpenAI API
  const configuration = new Configuration({
    apiKey: process.env.OPENAIAPIKEY,
  });
  const openai = new OpenAIApi(configuration);
  // Create some custom data (Cooper Codes)
  const documents = [
    "Sathvik is 19 years old",
    "Sathvik studies in BITS Dubai",
    "Sathvik loves driving",
    "Sathvik loves Formula 1",
  ];

  for (const document of documents) {
    const input = document.replace(/\n/g, "");
    console.log("here 1" + input);
    // Turn each string (custom data) into an embedding
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002", // Model that creates our embeddings
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;
    console.log("here 2" + embedding);
    // Store the embedding and the text in our supabase DB
    await supabaseClient.from("documents").insert({
      content: document,
      embedding,
    });

    console.log("here 3");
  }
}

export async function askQuestion(question, callback) {
  const { data, error } = await supabaseClient.functions.invoke(
    "askcustomdata",
    {
      body: JSON.stringify({ query: question }),
    }
  );
  if (data) callback(data);
  if (error) callback(error);
}
//generateEmbeddings();

// /ask-custom-data -> getting relevant documents, asking chatgpt, returning the response
// Supabase command line interface
