# Express TypeScript Decorators

A lightweight TypeScript decorator library for Express.js that enables clean, declarative routing using modern decorator syntax. Build organized, maintainable REST APIs with minimal boilerplate code.

- Table of Contents
- [Features](#features)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Decorators](#available-decorators)
- [Advanced Usage](#advanced-usage)
- [API Versioning](#api-versioning)
- [API Reference](#api-reference)
- [TypeScript Tips](#typescript-tips)
- [License](#license)

## Features

- 🎯 **Declarative Routing** - Use decorators to define HTTP endpoints
- 🚀 **TypeScript First** - Full TypeScript support with type safety
- 🔧 **Middleware Support** - Easy middleware integration per route
- 📦 **Lightweight** - Minimal dependencies and overhead
- 🎨 **Clean Architecture** - Organize your routes in controller classes
- 🌐 **Full HTTP Support** - All major HTTP methods supported
- 🔄 **API Versioning** - Built-in support for versioned APIs

## Dependencies

### Minimum Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0
- **Express**: >= 4.18.0

### Required TypeScript Configuration

Your `tsconfig.json` must include:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
  }
}
```

## Installation

```bash
npm install express-ts-decorators
```

## Quick Start

### 1. Create a Controller

```typescript
import express from 'express';
import { Controller, Get, Post, Put, Patch, Delete } from 'express-ts-decorators';

export class UserController extends Controller {
  constructor() {
    super('/users'); // Base path for all routes in this controller
  }

  @Get('/')
  async getAllUsers(_req: express.Request, res: express.Response) {
    const users = [{ id: 1, name: 'John Doe' }];
    res.json(users);
  }

  @Get('/:id')
  async getUserById(req: express.Request, res: express.Response) {
    const userId = req.params.id;
    const user = { id: userId, name: 'John Doe' };
    res.json(user);
  }

  @Post('/')
  async createUser(req: express.Request, res: express.Response) {
    const userData = req.body;
    const newUser = { id: Date.now(), ...userData };
    res.status(201).json(newUser);
  }

  @Put('/:id')
  async updateUser(req: express.Request, res: express.Response) {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = { id: userId, ...userData };
    res.json(updatedUser);
  }

  @Delete('/:id')
  async deleteUser(req: express.Request, res: express.Response) {
    const userId = req.params.id;
    res.json({ message: `User ${userId} deleted` });
  }
}
```

### 2. Attach Controller to Express App

```typescript
import express from 'express';
import { attachController } from 'express-ts-decorators';
import { UserController } from './controllers/UserController';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach controllers
attachController(app, new UserController());

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Available Decorators

### HTTP Method Decorators

| Decorator | HTTP Method | Description |
|-----------|-------------|-------------|
| `@Get(path, middleware?)` | GET | Retrieve resources |
| `@Post(path, middleware?)` | POST | Create new resources |
| `@Put(path, middleware?)` | PUT | Update/replace resources |
| `@Patch(path, middleware?)` | PATCH | Partial resource updates |
| `@Delete(path, middleware?)` | DELETE | Delete resources |
| `@Options(path, middleware?)` | OPTIONS | CORS preflight/API discovery |

### Parameters

- **`path`** (string): The route path relative to the controller's base path
- **`middleware`** (optional): Array of Express middleware functions

## Advanced Usage

### Using Middleware

```typescript
import { authMiddleware, validateUser } from './middleware';

export class UserController extends Controller {
  constructor() {
    super('/users');
  }

  @Get('/', [authMiddleware])
  async getUsers(_req: express.Request, res: express.Response) {
    // This route requires authentication
    res.json([]);
  }

  @Post('/', [authMiddleware, validateUser])
  async createUser(req: express.Request, res: express.Response) {
    // This route requires auth and validation
    res.status(201).json(req.body);
  }
}
```

### Multiple Controllers

```typescript
import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';
import { OrderController } from './controllers/OrderController';

const controllers = [
  new UserController(),
  new ProductController(),
  new OrderController()
];

controllers.forEach(controller => {
  attachController(app, controller);
});
```

## API Versioning

Express TypeScript Decorators provides built-in support for API versioning, making it easy to maintain multiple versions of your API simultaneously.

### Basic Versioning Setup

```typescript
import express from 'express';
import { createVersionMap, attachVersionMap } from 'express-ts-decorators';
import { UserControllerV1, ProductControllerV1 } from './controllers/v1';
import { UserControllerV2, ProductControllerV2, OrderControllerV2 } from './controllers/v2';

const app = express();

// Define controllers for each version
const v1Controllers = [new UserControllerV1(), new ProductControllerV1()];
const v2Controllers = [new UserControllerV2(), new ProductControllerV2(), new OrderControllerV2()];

// Create version map
const versionMap = createVersionMap(v1Controllers, v2Controllers);

// Attach all versioned routes to the app
attachVersionMap(app, versionMap);

// This creates:
// GET /v0/users     -> UserControllerV1
// GET /v0/products  -> ProductControllerV1
// GET /v1/users     -> UserControllerV2
// GET /v1/products  -> ProductControllerV2
// GET /v1/orders    -> OrderControllerV2
```

### Version-Specific Controllers

Create separate controller classes for each API version:

```typescript
// controllers/v1/UserController.ts
export class UserControllerV1 extends Controller {
  constructor() {
    super('/users');
  }

  @Get('/')
  async getUsers(_req: express.Request, res: express.Response) {
    // V1 implementation - simple user list
    const users = await this.userService.findAll();
    res.json(users);
  }
}

// controllers/v2/UserController.ts
export class UserControllerV2 extends Controller {
  constructor() {
    super('/users');
  }

  @Get('/')
  async getUsers(req: express.Request, res: express.Response) {
    // V2 implementation - with pagination and filtering
    const { page = 1, limit = 10, filter } = req.query;
    const users = await this.userService.findWithPagination(page, limit, filter);
    res.json({
      data: users,
      pagination: { page, limit, total: users.length }
    });
  }

  @Get('/:id/profile')
  async getUserProfile(req: express.Request, res: express.Response) {
    // New endpoint only available in V2
    const profile = await this.userService.getProfile(req.params.id);
    res.json(profile);
  }
}
```

### Manual Version Mapping

For more control over version paths, create version maps manually:

```typescript
import { VersionMap } from 'express-ts-decorators';

const customVersionMap: VersionMap = {
  '/v1': [new UserControllerV1(), new ProductControllerV1()],
  '/v2': [new UserControllerV2(), new ProductControllerV2()],
  '/beta': [new UserControllerBeta()],
  '/legacy': [new UserControllerLegacy()]
};

attachVersionMap(app, customVersionMap);
```

## API Reference

### Controller Class

```typescript
class Controller {
  constructor(path: string)
  readonly path: string
  readonly router: express.Router
}
```

### attachController Function

```typescript
function attachController(app: express.Application, controller: Controller): void
```

Attaches a controller instance to an Express application, registering all decorated routes.

### Versioning Functions

#### createVersionMap Function

```typescript
function createVersionMap(...versions: Array<Controller[]>): VersionMap
```

Creates a version map from arrays of controllers. Each array index corresponds to a version path (0 → /v0, 1 → /v1, etc.).

#### attachVersionMap Function

```typescript
function attachVersionMap(app: express.Application, versionMap: VersionMap): void
```

Attaches a version map to an Express application, automatically creating routers for each version.

#### VersionMap Type

```typescript
type VersionMap = Record<string, Controller[]>
```

Type definition for version maps, where keys are version paths and values are arrays of controllers.

## TypeScript Tips

### Unused Parameters

For parameters you don't use, prefix with underscore to avoid TypeScript warnings:

```typescript
@Get('/')
async getUsers(_req: express.Request, res: express.Response) {
  // _req indicates intentionally unused parameter
  res.json([]);
}
```

### Type Safety

The decorators support generic types for enhanced type safety:

```typescript
@Get<CustomRequest, CustomResponse>('/')
async getUsers(req: CustomRequest, res: CustomResponse) {
  // Full type safety with custom types
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
