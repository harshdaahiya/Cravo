# Cravo Server Architecture & Developer Guide

Welcome to the Cravo Backend! This project has been migrated from JavaScript to **TypeScript** using a modern **Object-Oriented Programming (OOP)** approach. This document serves as a comprehensive guide for new developers to understand the design patterns, structure, and best practices used in this codebase.

---

## Architecture Overview

The server follows an **N-Tier Architecture** with a focus on separation of concerns. We use the **Repository Pattern** to decouple our data access logic from the business logic.

### Core Components

1. **Models**: Mongoose schemas and TypeScript interfaces representing the data structure.
2. **Repositories**: Data access layer. Handles all database queries (CRUD).
3. **Controllers**: Business logic layer. Handles incoming requests, validates input, and communicates with repositories.
4. **Routers**: Routing layer. Mapping HTTP endpoints to controller methods.
5. **Middlewares**: Cross-cutting concerns like Authentication, Error Handling, and Validation.
6. **Services**: Third-party integrations (Cloudinary, Razorpay, Email).

---

## Directory Structure

```text
server/src/
├── config/             # Configuration (Passport, Razorpay, Cloudinary)
├── controllers/        # Business logic classes
├── middlewares/        # Express middlewares (Auth, Errors)
├── models/             # Mongoose models & interfaces
├── repositories/       # Data access layer (Mongoose queries)
├── routes/             # API route definitions
├── services/           # External service integrations (Email, Tokens)
├── types/              # Global TypeScript type definitions
├── utils/              # Helper functions & utilities
├── app.ts              # Express application setup
└── server.ts           # Entry point (Server listener)
```

---

## Key Design Patterns

### 1. Base Classes (Inheritance)

To avoid code duplication, we use base classes for common functionality:

- **`BaseRepository<T>`**: Provides standard methods like `find`, `findById`, `create`, `update`, and `delete`.
- **`BaseController`**: Provides helper methods like `sendSuccess` and `sendError` for standardized API responses.
- **`BaseRouter`**: Standardizes router initialization.

### 2. The Repository Pattern

Controllers **never** call Mongoose methods directly. They use Repositories.

- **Why?** It makes testing easier and allows us to change the database layer (e.g., from MongoDB to Postgres) without touching the controllers.

```typescript
// Example: Using a repository in a controller
public getCity = async (req: Request, res: Response) => {
  const city = await cityRepository.findById(req.params.id);
  return this.sendSuccess(res, { city });
}
```

### 3. Standardized API Responses

Every API response follows a consistent JSON structure:

```json
{
  "success": true,
  "message": "Action completed",
  "data": { ... },
  "statusCode": 200
}
```

> [!IMPORTANT]
> All data returned in the `data` field is **keyed** (e.g., `{ restaurant: { ... } }` instead of just `{ ... }`). This prevents breaking changes when adding more fields to a response.

---

## How to Add a New Feature (Step-by-Step)

If you need to add a new entity (e.g., `Review`):

1. **Create Model**: Define the interface (`IReview`) and schema in `src/models/review-model.ts`.
2. **Create Repository**: Extend `BaseRepository<IReview>` in `src/repositories/review-repository.ts`.
3. **Create Controller**: Extend `BaseController` in `src/controllers/review-controller.ts`.
4. **Create Router**: Extend `BaseRouter` in `src/routes/review-router.ts`.
5. **Register Router**: Import and add the new router to `src/app.ts`.

---

## Best Practices

- **Use Async/Await**: Always use `async/await`. Wrapped with `asyncHandler` (provided in `src/services/async-handler.ts`) to catch errors automatically.
- **Strict Typing**: Avoid using `any`. Use interfaces and types for all data.
- **Dependency Injection**: Use singleton instances of repositories (e.g., `export const cityRepository = new CityRepository()`) to share state/logic efficiently.
- **Error Handling**: Throw `ApiError` instances for predictable error responses.

---

## Development & Deployment

- **Development**: `npm run dev` (uses `tsx` for fast refresh).
- **Production Build**: `npm run build` (compiles to `dist/`).
- **CI/CD**: GitHub Actions handles deployments. It runs `npm run build` to verify type-safety before deploying to Render.

---

*“Clean code always looks like it was written by someone who cares.”* – Michael Feathers
