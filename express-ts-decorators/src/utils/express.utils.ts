import express from 'express';
import { Controller } from '../controller';

export type VersionMap = Record<string, Controller[]>;

/**
 * Utility function for mapping Controller to an Express Router
 * @param router The router to attach the controller too
 * @param controller The controller to attach
 */
export function attachController(
  router: express.Router,
  controller: Controller
) {
  router.use(controller.path, controller.router);
}

/**
 * To support versioned APIs, this allows for the developer to pass multiple arrays of
 * controllers and this function will generate Map of versions based on the index of the array.
 *
 * @param versions Array of controller arrays. Each controller in the array will be mapped to that version path (ex: 1 to /v1, 2 to /v2, etc.)
 * @returns The version map
 *
 * @example
 * ```typescript
 * import { createVersionMap, attachController } from 'express-ts-decorators';
 * import { UserControllerV1, ProductControllerV1 } from './controllers/v1';
 * import { UserControllerV2, ProductControllerV2, OrderControllerV2 } from './controllers/v2';
 * import { UserControllerV3 } from './controllers/v3';
 *
 * // Define controllers for each version
 * const v1Controllers = [new UserControllerV1(), new ProductControllerV1()];
 * const v2Controllers = [new UserControllerV2(), new ProductControllerV2(), new OrderControllerV2()];
 * const v3Controllers = [new UserControllerV3()];
 *
 * // Create version map
 * const versionMap = createVersionMap(v1Controllers, v2Controllers, v3Controllers);
 *
 * // Result:
 * // {
 * //   '/v0': [UserControllerV1, ProductControllerV1],
 * //   '/v1': [UserControllerV2, ProductControllerV2, OrderControllerV2],
 * //   '/v2': [UserControllerV3]
 * // }
 *
 * // Attach all versions to Express app
 * Object.entries(versionMap).forEach(([versionPath, controllers]) => {
 *   const versionRouter = express.Router();
 *   controllers.forEach(controller => {
 *     attachController(versionRouter, controller);
 *   });
 *   app.use(versionPath, versionRouter);
 * });
 *
 * // This creates the following API structure:
 * // GET /v0/users     -> UserControllerV1
 * // GET /v0/products  -> ProductControllerV1
 * // GET /v1/users     -> UserControllerV2
 * // GET /v1/products  -> ProductControllerV2
 * // GET /v1/orders    -> OrderControllerV2
 * // GET /v2/users     -> UserControllerV3
 * ```
 */
export function createVersionMap(...versions: Array<Controller[]>) {
  const versionMap: Record<string, Controller[]> = {};

  for (const version in versions) {
    const versionPath = `/v${version}`;
    versionMap[versionPath] = versions[version];
  }

  return versionMap;
}

/**
 * Attaches a version map to an Express application, automatically creating routers
 * for each version and registering all controllers within each version.
 *
 * @param app The Express application to attach the versioned routes to
 * @param versionMap The version map created by createVersionMap function
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createVersionMap, attachVersionMap } from 'express-ts-decorators';
 * import { UserControllerV1, ProductControllerV1 } from './controllers/v1';
 * import { UserControllerV2, ProductControllerV2 } from './controllers/v2';
 *
 * const app = express();
 *
 * // Create controllers for each version
 * const v1Controllers = [new UserControllerV1(), new ProductControllerV1()];
 * const v2Controllers = [new UserControllerV2(), new ProductControllerV2()];
 *
 * // Create version map
 * const versionMap = createVersionMap(v1Controllers, v2Controllers);
 *
 * // Attach all versioned routes to the app in one call
 * attachVersionMap(app, versionMap);
 *
 * // This automatically creates:
 * // GET /v0/users     -> UserControllerV1.getUsers()
 * // POST /v0/users    -> UserControllerV1.createUser()
 * // GET /v0/products  -> ProductControllerV1.getProducts()
 * // GET /v1/users     -> UserControllerV2.getUsers()
 * // POST /v1/users    -> UserControllerV2.createUser()
 * // GET /v1/products  -> ProductControllerV2.getProducts()
 *
 * app.listen(3000, () => {
 *   console.log('Versioned API server running on port 3000');
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Alternative: Manual version map creation
 * const manualVersionMap: VersionMap = {
 *   '/v1': [new UserControllerV1(), new ProductControllerV1()],
 *   '/v2': [new UserControllerV2(), new ProductControllerV2()],
 *   '/beta': [new UserControllerBeta()]
 * };
 *
 * attachVersionMap(app, manualVersionMap);
 * ```
 */
export function attachVersionMap(
  app: express.Application,
  versionMap: VersionMap
) {
  for (const path in versionMap) {
    const router = express.Router({ mergeParams: true });

    for (const Controller of versionMap[path]) {
      attachController(router, Controller);
    }

    app.use(path, router);
  }
}
