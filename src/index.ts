#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { createSwimlaneDiagram, generateSwimlaneImage, getSwimlaneImageLink } from './tools/swimlane-tools.js';

/**
 * Swimlanes.io MCP Server
 * 
 * This MCP server provides tools for generating swimlane diagrams using the Swimlanes.io API.
 * It supports creating markdown documentation with embedded diagrams for version control.
 */

const server = new Server(
  {
    name: 'swimlanes-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_swimlane_documentation',
        description: 'Generate a complete markdown documentation file with swimlane diagram syntax and embedded images, ready for version control',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Swimlanes syntax content',
            },
            title: {
              type: 'string',
              description: 'Diagram title',
            },
            description: {
              type: 'string',
              description: 'Description of what the diagram represents',
            },
            outputPath: {
              type: 'string',
              description: 'Where to save markdown file (optional, auto-generated if not provided)',
            },
            includeImage: {
              type: 'boolean',
              description: 'Whether to embed rendered image (default: true)',
              default: true,
            },
            folderStructure: {
              type: 'string',
              description: 'Optional folder organization (e.g., "auth", "api")',
            },
          },
          required: ['text', 'title'],
        },
      },
      {
        name: 'generate_swimlane_image',
        description: 'Generate and save a PNG image of a swimlane diagram',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Swimlanes syntax content',
            },
            title: {
              type: 'string',
              description: 'Optional title',
            },
            highResolution: {
              type: 'boolean',
              description: 'For printing quality (default: false)',
              default: false,
            },
            outputPath: {
              type: 'string',
              description: 'Where to save (optional, auto-generated if not provided)',
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'get_swimlane_image_link',
        description: 'Generate a direct link to a PNG image without downloading',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Swimlanes syntax content',
            },
            title: {
              type: 'string',
              description: 'Optional title',
            },
            highResolution: {
              type: 'boolean',
              description: 'For printing quality (default: false)',
              default: false,
            },
          },
          required: ['text'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_swimlane_documentation':
        return await createSwimlaneDiagram(args);
      
      case 'generate_swimlane_image':
        return await generateSwimlaneImage(args);
      
      case 'get_swimlane_image_link':
        return await getSwimlaneImageLink(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Swimlanes MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
