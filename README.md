# Swimlanes.io MCP Server

A Model Context Protocol (MCP) server that integrates with Swimlanes.io to generate sequence diagrams from textual descriptions. This server enables AI assistants like GitHub Copilot to automatically analyze project codebases and create comprehensive diagram documentation.

## Features

- **Markdown Documentation Generation**: Creates complete markdown files with embedded diagrams
- **Version Control Ready**: Stores both source syntax and rendered images for git tracking
- **Multiple Output Formats**: Supports both direct image generation and shareable links
- **Project Analysis**: Designed for Copilot to analyze codebases and generate relevant diagrams
- **Organized Structure**: Automatically organizes diagrams into logical folder structures

## Installation

```bash
npm install
npm run build
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "swimlanes": {
      "command": "node",
      "args": ["path/to/dist/index.js"]
    }
  }
}
```

### With MCP Inspector (for testing)

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Tools

### 1. `create_swimlane_documentation`

Generates complete markdown documentation with embedded diagrams.

**Parameters:**
- `text` (string, required): Swimlanes syntax content
- `title` (string, required): Diagram title
- `description` (string, optional): Description of the diagram
- `outputPath` (string, optional): Where to save the markdown file
- `includeImage` (boolean, optional): Whether to embed rendered image (default: true)
- `folderStructure` (string, optional): Folder organization (e.g., "auth", "api")

### 2. `generate_swimlane_image`

Generates and saves a PNG image of a swimlane diagram.

**Parameters:**
- `text` (string, required): Swimlanes syntax content
- `title` (string, optional): Optional title
- `highResolution` (boolean, optional): For printing quality (default: false)
- `outputPath` (string, optional): Where to save the image

### 3. `get_swimlane_image_link`

Generates a direct link to a PNG image without downloading.

**Parameters:**
- `text` (string, required): Swimlanes syntax content
- `title` (string, optional): Optional title
- `highResolution` (boolean, optional): For printing quality (default: false)

## Swimlanes.io Syntax

The server supports the full Swimlanes.io syntax:

```swimlanes
title: Example Diagram
A -> B: Message
B -> A: Response
note over A: Internal process
```

For complete syntax reference, see: <https://swimlanes.io/gallery/full-syntax>

## Example Usage with Copilot

Ask Copilot: "Using the SL_MCP Server, build me swim lane diagrams for this project"

Copilot will analyze your codebase and generate appropriate diagrams for:
- Authentication flows
- API request lifecycles
- Service communications
- User journeys
- Data processing pipelines

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Run tests
npm run test

# Lint code
npm run lint
```

## Project Structure

```
src/
├── index.ts           # Main MCP server entry point
├── types.ts           # TypeScript type definitions
└── tools/
    ├── index.ts       # Tool exports
    └── swimlane-tools.ts  # Core tool implementations
```

## Generated Documentation Structure

The server creates well-organized documentation:

```
docs/diagrams/
├── auth/
│   ├── login-flow.md
│   └── images/
│       └── login-flow.png
├── api/
│   ├── request-lifecycle.md
│   └── images/
│       └── request-lifecycle.png
└── architecture/
    ├── service-communication.md
    └── images/
        └── service-communication.png
```

## License

MIT
