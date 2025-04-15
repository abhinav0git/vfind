"use server";

import { GoogleGenAI, Modality } from "@google/genai";

export async function vtonProcessor(personImage: string, clothImage: string) {

  const apiKey = process.env.GOOGLE_API_KEY as string;
  const genAI = new GoogleGenAI({ apiKey });
  console.log("api", "t" + apiKey + "t");

  const prompt = "Generate a photorealistic image of the person wearing the clothing item.";

  const contents = [
    { text: prompt },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: personImage.split(",")[1], // remove base64 header
      },
    },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: clothImage.split(",")[1],
      },
    },
  ];

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;

    if (!candidates || !candidates.length || !candidates[0].content) {
      throw new Error("No valid content returned from Gemini model.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data,
        };
      }
    }

    throw new Error("No image was returned in the response.");
  } catch (error: any) {
    console.error("VTON Error:", error);
    throw new Error(`Failed to generate virtual try-on image: ${error.message}`);
  }
}
