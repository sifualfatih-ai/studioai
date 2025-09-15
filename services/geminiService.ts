
import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio, VideoModel } from "../types";

// FIX: Initialize the GoogleGenAI client according to guidelines, removing the 'as string' cast.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

/**
 * Converts a File object to a base64 encoded string, without the data URI prefix.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

/**
 * Generates a storyboard frame image by combining a product, optional face, and a prompt.
 */
export const generateStoryboardFrame = async (prompt: string, productBase64: string, faceBase64: string | null): Promise<string> => {
    const parts: any[] = [
        // Assuming JPEG for uploaded files based on common formats.
        { inlineData: { mimeType: 'image/jpeg', data: productBase64 } },
        { text: prompt },
    ];
    if (faceBase64) {
        parts.splice(1, 0, { inlineData: { mimeType: 'image/jpeg', data: faceBase64 } });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated for storyboard frame.");
};

// FIX: Add generateImage function to resolve import error in ImageGenerator.tsx
/**
 * Generates images from a text prompt.
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio, numberOfImages: number): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed or returned no images.");
    }

    return response.generatedImages.map(generatedImage => {
        const base64ImageBytes: string = generatedImage.image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    });
};

/**
 * Generates a video from a single image frame from the storyboard.
 */
export const generateVideoFromImage = async (imageDataUri: string): Promise<string> => {
    const [header, data] = imageDataUri.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: 'Animate this image into a short, engaging promotional video clip.',
        image: {
            imageBytes: data,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no link.");
    }

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

/**
 * MOCK: Generates a voice-over audio file.
 */
export const generateVoiceOver = async (script: string, actorId: string, vibeId: string, speed: number): Promise<string> => {
    console.log('Generating voice over with:', { script, actorId, vibeId, speed });
    // NOTE: The Gemini API does not currently support Text-to-Speech.
    // This is a mock function that returns a placeholder audio file.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    return 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'; // Placeholder URL
};

interface GenerateVideoParams {
    prompt: string;
    model: VideoModel;
    aspectRatio: AspectRatio; 
    duration: number;
    imageBase64: string | null;
}

/**
 * Generates a video from a prompt and optional image.
 */
export const generateVideo = async (params: GenerateVideoParams): Promise<string> => {
    const modelName = 'veo-2.0-generate-001';
    
    const request: any = {
        model: modelName,
        // The VEO API does not have explicit parameters for duration or aspect ratio.
        // We include them in the prompt as a suggestion to the model.
        prompt: `${params.prompt} (duration: ${params.duration} seconds, aspect ratio: ${params.aspectRatio})`,
        config: {
            numberOfVideos: 1
        }
    };

    if (params.imageBase64) {
        request.image = {
            imageBytes: params.imageBase64,
            mimeType: 'image/jpeg', // Assuming uploaded image is jpeg/png
        }
    }
    
    let operation = await ai.models.generateVideos(request);

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no link.");
    }
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
     if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};
