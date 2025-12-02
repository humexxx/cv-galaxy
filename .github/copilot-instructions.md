# GitHub Copilot Instructions

## Project Structure Rules

### TypeScript Types & Interfaces
- **Always** define types and interfaces in `types/` directory
- Group related types in dedicated files (e.g., `types/ai.ts`, `types/cv.ts`)
- Export types for use across the application
- **Exception**: Component props interfaces can be defined at component level (e.g., `AiButtonProps`, `CvWithChatLayoutProps`)
- Never define business logic types inline in components or API routes

### Zod Schemas & Validation
- **Always** define Zod schemas in `schemas/` directory
- Use Zod schemas for API request/response validation
- Export inferred types from schemas (e.g., `type ChatRequest = z.infer<typeof chatRequestSchema>`)
- Validate data on both client and server sides using the same schemas

### Component Organization
- UI components in `components/ui/`
- Feature components in `components/`
- Break down complex components into smaller, focused components
- Client components must have `"use client"` directive
- Server components are default (no directive needed)

### Services
- **Always** define API calls in `lib/services/` directory
- Create service classes for each API domain (e.g., `ChatService`, `UserService`)
- Services handle validation, error handling, and API communication
- **Never** make raw fetch calls directly in components - always use services
- Services provide a single source of truth for API interactions
- Each service method should handle its own error handling and validation

### API Routes
- Import types from `types/` directory and schemas from `schemas/` directory
- Always validate requests using Zod schemas
- Keep route handlers focused and simple
- Use proper HTTP status codes and error handling

### Naming Conventions
- Files: kebab-case (`ai-button.tsx`, `cv-with-chat-layout.tsx`)
- Components: PascalCase (`AiButton`, `CvWithChatLayout`)
- Types/Interfaces: PascalCase (`AIModel`, `CvWithChatLayoutProps`)
- Functions/variables: camelCase (`fetchModels`, `selectedModel`)

### Import Order
1. External packages (React, Next.js, etc.)
2. Internal UI components
3. Internal feature components
4. Types
5. Utilities/helpers
6. Styles

### Code Style & Comments
- Avoid unnecessary comments and JSDoc annotations
- Only add comments when absolutely necessary for complex logic
- Code should be self-explanatory through clear naming and structure
- Use TypeScript types instead of JSDoc for type documentation
