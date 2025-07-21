# Usage Examples

This document provides practical examples of using the Swimlanes MCP Server.

## Quick Start with MCP Inspector

1. **Start the Inspector:**
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Open the browser link provided** (similar to):
   ```
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...
   ```

3. **Test the tools in the inspector interface**

## Example Swimlanes Syntax

### Basic Authentication Flow
```swimlanes
title: User Authentication
User -> Frontend: Enter credentials
Frontend -> API: POST /auth/login
API -> Database: Validate user
Database -> API: User data
API -> Frontend: JWT token
Frontend -> User: Login success
```

### API Request Lifecycle
```swimlanes
title: API Request Processing
Client -> Load Balancer: HTTP Request
Load Balancer -> API Gateway: Route request
API Gateway -> Service: Process request
Service -> Database: Query data
Database -> Service: Return results
Service -> Cache: Store result
Service -> API Gateway: Response
API Gateway -> Load Balancer: Response
Load Balancer -> Client: HTTP Response
```

### Microservices Communication
```swimlanes
title: Order Processing
User -> Order Service: Place order
Order Service -> Payment Service: Process payment
Payment Service -> Bank API: Charge card
Bank API -> Payment Service: Payment confirmed
Payment Service -> Order Service: Payment success
Order Service -> Inventory Service: Reserve items
Inventory Service -> Order Service: Items reserved
Order Service -> Notification Service: Send confirmation
Notification Service -> User: Email confirmation
```

## Tool Usage Examples

### 1. Create Complete Documentation

**Tool:** `create_swimlane_documentation`

**Use Case:** Generate a complete markdown file with diagram for documentation

**Example Request:**
```json
{
  "text": "title: User Registration\nUser -> Frontend: Fill form\nFrontend -> API: POST /users\nAPI -> Database: Create user\nDatabase -> API: User ID\nAPI -> Email Service: Send welcome email\nEmail Service -> User: Welcome email",
  "title": "User Registration Process",
  "description": "This diagram shows the complete user registration workflow including email confirmation.",
  "outputPath": "docs/diagrams/auth/user-registration.md",
  "includeImage": true,
  "folderStructure": "auth"
}
```

**Generated Output:**
- File: `docs/diagrams/auth/user-registration.md`
- Image: `docs/diagrams/auth/images/user-registration.png`
- Complete markdown with embedded diagram

### 2. Generate Image Only

**Tool:** `generate_swimlane_image`

**Use Case:** Create a high-resolution diagram for presentations

**Example Request:**
```json
{
  "text": "title: Data Pipeline\nETL Service -> Data Lake: Extract data\nData Lake -> Processing Engine: Transform data\nProcessing Engine -> Data Warehouse: Load data",
  "title": "Data Processing Pipeline",
  "highResolution": true,
  "outputPath": "diagrams/data-pipeline.png"
}
```

### 3. Get Shareable Link

**Tool:** `get_swimlane_image_link`

**Use Case:** Quickly share a diagram via URL

**Example Request:**
```json
{
  "text": "title: Bug Report Flow\nUser -> Support Portal: Report bug\nSupport Portal -> Triage Team: Assign ticket\nTriage Team -> Dev Team: Create task\nDev Team -> QA: Deploy fix\nQA -> User: Confirm resolution",
  "title": "Bug Resolution Process"
}
```

## Integration with AI Assistants

### GitHub Copilot Usage

Ask Copilot:
> "Using the SL_MCP Server, build me swim lane diagrams for this project"

Copilot will:
1. Analyze your codebase
2. Identify key workflows and processes
3. Generate appropriate swimlane diagrams
4. Create organized documentation

### Common Use Cases

1. **Authentication Systems**
   - Login/logout flows
   - Password reset processes
   - Multi-factor authentication

2. **API Documentation**
   - Request/response cycles
   - Error handling flows
   - Rate limiting processes

3. **Microservices Architecture**
   - Service-to-service communication
   - Data flow between services
   - Event-driven architectures

4. **User Journeys**
   - Registration processes
   - Shopping cart workflows
   - Content creation flows

5. **DevOps Processes**
   - CI/CD pipelines
   - Deployment workflows
   - Monitoring and alerting

## File Organization

The server automatically organizes generated files:

```
docs/diagrams/
├── auth/
│   ├── login-flow.md
│   ├── registration-process.md
│   └── images/
│       ├── login-flow.png
│       └── registration-process.png
├── api/
│   ├── request-lifecycle.md
│   └── images/
│       └── request-lifecycle.png
└── architecture/
    ├── microservices-overview.md
    └── images/
        └── microservices-overview.png
```

## Tips for Better Diagrams

1. **Use Clear Titles**: Always include descriptive titles
2. **Logical Flow**: Order interactions chronologically
3. **Meaningful Names**: Use descriptive actor/service names
4. **Add Context**: Include notes for complex steps
5. **Group Related Flows**: Use folderStructure for organization

## Troubleshooting

### Common Issues

1. **Network Errors**: Ensure internet connectivity for Swimlanes.io API
2. **File Permissions**: Check write permissions for output directories
3. **Syntax Errors**: Validate swimlanes syntax using the gallery

### Getting Help

- Check the [Swimlanes.io syntax guide](https://swimlanes.io/gallery/full-syntax)
- View examples in the gallery
- Test syntax in the browser editor first

## Advanced Features

### High-Resolution Images
Set `highResolution: true` for print-quality diagrams

### Custom File Paths
Specify exact output locations with `outputPath`

### Batch Generation
Use the documentation tool to create multiple diagrams with consistent formatting

### Version Control Integration
Generated markdown files work perfectly with git for tracking diagram changes over time
