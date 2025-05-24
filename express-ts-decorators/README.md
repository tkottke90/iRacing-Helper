# Express TypeScript Decorators

A lightweight TypeScript decorator library for Express.js that enables clean, declarative routing using modern decorator syntax. Build organized, maintainable REST APIs with minimal boilerplate code.

## Features

- 🎯 **Declarative Routing** - Use decorators to define HTTP endpoints
- 🚀 **TypeScript First** - Full TypeScript support with type safety
- 🔧 **Middleware Support** - Easy middleware integration per route
- 📦 **Lightweight** - Minimal dependencies and overhead
- 🎨 **Clean Architecture** - Organize your routes in controller classes
- 🌐 **Full HTTP Support** - All major HTTP methods supported

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
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
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

### Error Handling

```typescript
export class UserController extends Controller {
  @Get('/:id')
  async getUserById(req: express.Request, res: express.Response) {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
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
