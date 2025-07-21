import { z } from 'zod';

// Input validation schemas
export const CreateSwimlaneDocumentationSchema = z.object({
  text: z.string().min(1, 'Swimlanes syntax content is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  outputPath: z.string().optional(),
  includeImage: z.boolean().default(true),
  folderStructure: z.string().optional(),
});

export const GenerateSwimlaneImageSchema = z.object({
  text: z.string().min(1, 'Swimlanes syntax content is required'),
  title: z.string().optional(),
  highResolution: z.boolean().default(false),
  outputPath: z.string().optional(),
});

export const GetSwimlaneImageLinkSchema = z.object({
  text: z.string().min(1, 'Swimlanes syntax content is required'),
  title: z.string().optional(),
  highResolution: z.boolean().default(false),
});

// Response types
export interface SwimlaneResponse {
  success: boolean;
  markdownPath?: string;
  imagePath?: string;
  diagramUrl?: string;
  imageUrl?: string;
  content?: string;
  error?: string;
}

export interface SwimlaneImageResponse {
  success: boolean;
  imagePath?: string;
  imageUrl?: string;
  error?: string;
}

export interface SwimlaneImageLinkResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// Swimlanes.io API types
export interface SwimlaneApiLinkResponse {
  // The API returns a 201 with Location header
  // No body content expected
}

export interface SwimlaneApiImageResponse {
  // The API returns a 303 redirect with Location header pointing to the image
  // Or the actual image binary data
}

// Error types
export type SwimlaneErrorCode = 'SYNTAX_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT' | 'FILE_ERROR';

export interface SwimlaneError {
  success: false;
  error: string;
  errorCode?: SwimlaneErrorCode;
  suggestions?: string[];
}

// Input types (inferred from schemas)
export type CreateSwimlaneDocumentationInput = z.infer<typeof CreateSwimlaneDocumentationSchema>;
export type GenerateSwimlaneImageInput = z.infer<typeof GenerateSwimlaneImageSchema>;
export type GetSwimlaneImageLinkInput = z.infer<typeof GetSwimlaneImageLinkSchema>;
