"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
    auth(); // protect this route with clerk

    //turn a PDF into embeddings
    await generateEmbeddingsInPineconeVectorStore(docId);

    revalidatePath("/dashboard");

    return { completed: true };
}

