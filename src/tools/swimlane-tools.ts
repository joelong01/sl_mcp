import axios from 'axios';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import {
  SwimlaneResponse,
  SwimlaneImageResponse,
  SwimlaneImageLinkResponse,
  CreateSwimlaneDocumentationSchema,
  GenerateSwimlaneImageSchema,
  GetSwimlaneImageLinkSchema,
} from '../types.js';

const SWIMLANES_API_BASE = 'https://api.swimlanes.io/v1';

/**
 * Create a complete markdown documentation file with swimlane diagram
 */
export async function createSwimlaneDiagram(input: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const validated = CreateSwimlaneDocumentationSchema.parse(input);
    
    // Prepare the swimlanes text with title if provided
    let swimlanesText = validated.text;
    if (validated.title && !swimlanesText.startsWith('title:')) {
      swimlanesText = `title: ${validated.title}\n${swimlanesText}`;
    }

    // Generate the shareable link
    const diagramUrl = await generateImageLink(swimlanesText);
    
    // Generate image if requested
    let imagePath: string | undefined;
    
    if (validated.includeImage) {
      const imageResult = await downloadImage(swimlanesText, validated.title);
      imagePath = imageResult.imagePath;
    }

    // Generate markdown content
    const markdownContent = generateMarkdownContent({
      title: validated.title,
      description: validated.description,
      swimlanesText,
      diagramUrl,
      imagePath,
    });

    // Determine output path
    const outputPath = validated.outputPath || generateMarkdownPath(validated.title, validated.folderStructure);
    
    // Ensure directory exists
    const outputDir = dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write markdown file
    await fs.writeFile(outputPath, markdownContent, 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            markdownPath: outputPath,
            diagramUrl,
            imagePath,
            imageUrl: imagePath ? diagramUrl : undefined,
          } as SwimlaneResponse, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          } as SwimlaneResponse, null, 2),
        },
      ],
    };
  }
}

/**
 * Generate and save a PNG image of a swimlane diagram
 */
export async function generateSwimlaneImage(input: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const validated = GenerateSwimlaneImageSchema.parse(input);
    
    // Prepare the swimlanes text with title if provided
    let swimlanesText = validated.text;
    if (validated.title && !swimlanesText.startsWith('title:')) {
      swimlanesText = `title: ${validated.title}\n${swimlanesText}`;
    }

    // Download the image
    const result = await downloadImage(
      swimlanesText,
      validated.title,
      validated.outputPath,
      validated.highResolution
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            imagePath: result.imagePath,
            imageUrl: result.imageUrl,
          } as SwimlaneImageResponse, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          } as SwimlaneImageResponse, null, 2),
        },
      ],
    };
  }
}

/**
 * Get a shareable link to a swimlane diagram image
 */
export async function getSwimlaneImageLink(input: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const validated = GetSwimlaneImageLinkSchema.parse(input);
    
    // Prepare the swimlanes text with title if provided
    let swimlanesText = validated.text;
    if (validated.title && !swimlanesText.startsWith('title:')) {
      swimlanesText = `title: ${validated.title}\n${swimlanesText}`;
    }

    // Generate the image link
    const imageUrl = await generateImageLink(swimlanesText, validated.highResolution);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            imageUrl,
          } as SwimlaneImageLinkResponse, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          } as SwimlaneImageLinkResponse, null, 2),
        },
      ],
    };
  }
}

/**
 * Generate a shareable image link using Swimlanes.io API
 */
async function generateImageLink(text: string, highResolution: boolean = false): Promise<string> {
  try {
    const payload: { text: string; high_resolution?: boolean } = { text };
    if (highResolution) {
      payload.high_resolution = true;
    }

    const response = await axios.post(`${SWIMLANES_API_BASE}/image-link`, payload, {
      headers: { 'Content-Type': 'application/json' },
      maxRedirects: 0,
      validateStatus: (status) => status === 201,
    });
    
    const location = response.headers.location;
    if (!location) {
      throw new Error('No location header returned from Swimlanes.io API');
    }
    
    return location;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Swimlanes.io API error: ${error.response.status} ${error.response.statusText}`);
    }
    throw error;
  }
}

/**
 * Download an image from Swimlanes.io API and save it locally
 */
async function downloadImage(
  text: string,
  title?: string,
  outputPath?: string,
  highResolution: boolean = false
): Promise<{ imagePath: string; imageUrl: string }> {
  try {
    const payload: { text: string; high_resolution?: boolean } = { text };
    if (highResolution) {
      payload.high_resolution = true;
    }

    const response = await axios.post(`${SWIMLANES_API_BASE}/image`, payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'arraybuffer',
      maxRedirects: 5, // Follow redirects to get the actual image
    });
    
    // Generate output path if not provided
    const imagePath = outputPath || generateImagePath(title);
    
    // Ensure directory exists
    const imageDir = dirname(imagePath);
    await fs.mkdir(imageDir, { recursive: true });
    
    // Write image file
    await fs.writeFile(imagePath, response.data);
    
    // Also generate the shareable URL
    const imageUrl = await generateImageLink(text, highResolution);
    
    return { imagePath, imageUrl };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Swimlanes.io API error: ${error.response.status} ${error.response.statusText}`);
    }
    throw error;
  }
}

/**
 * Generate markdown content for documentation
 */
function generateMarkdownContent(params: {
  title: string;
  description?: string;
  swimlanesText: string;
  diagramUrl: string;
  imagePath?: string;
}): string {
  const { title, description, swimlanesText, diagramUrl, imagePath } = params;
  
  let content = `# ${title}\n\n`;
  
  if (description) {
    content += `*${description}*\n\n`;
  }
  
  content += `## Overview\n\nThis diagram was automatically generated from the codebase analysis.\n\n`;
  
  content += `## Diagram Source\n\n\`\`\`swimlanes\n${swimlanesText}\n\`\`\`\n\n`;
  
  if (imagePath) {
    const relativePath = imagePath.startsWith('./') ? imagePath : `./${imagePath.split('/').slice(-2).join('/')}`;
    content += `## Diagram\n\n![${title}](${relativePath})\n\n`;
  }
  
  content += `## Links\n\n- [Interactive Diagram](${diagramUrl})\n- [Swimlanes.io](https://swimlanes.io/)\n\n`;
  
  content += `---\n\n*Generated on ${new Date().toISOString().split('T')[0]} using Swimlanes MCP Server*\n`;
  
  return content;
}

/**
 * Generate a suitable markdown file path
 */
function generateMarkdownPath(title: string, folderStructure?: string): string {
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const filename = `${sanitizedTitle}.md`;
  
  if (folderStructure) {
    return join('docs', 'diagrams', folderStructure, filename);
  }
  
  return join('docs', 'diagrams', filename);
}

/**
 * Generate a suitable image file path
 */
function generateImagePath(title?: string): string {
  const sanitizedTitle = (title || 'diagram').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const filename = `${sanitizedTitle}.png`;
  
  return join('docs', 'diagrams', 'images', filename);
}
