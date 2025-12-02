# GitHub Copilot Instructions

## Project Structure Rules

### TypeScript Types & Interfaces
- **Always** define types and interfaces in `types/` directory
- Group related types in dedicated files (e.g., `types/ai.ts`, `types/cv.ts`)
- Export types for use across the application
- **Exception**: Component props interfaces can be defined at component level (e.g., `AiButtonProps`, `CvWithChatLayoutProps`)
- Never define business logic types inline in components or API routes

### Component Organization
- UI components in `components/ui/`
- Feature components in `components/`
- Client components must have `"use client"` directive
- Server components are default (no directive needed)

### API Routes
- Import types from `types/` directory
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
