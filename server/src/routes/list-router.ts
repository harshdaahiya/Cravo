import { listController } from '../controllers/list-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class ListRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);

    this.router.get('/', listController.getAllListOfUser);
    this.router.get('/:id', listController.getListById);
    this.router.post('/', listController.createNewList);
    this.router.post('/transfer', listController.transferProductToList);
    this.router.post('/:id/add', listController.addProductToList);
    this.router.post('/:id/remove', listController.removeProductFromList);
    this.router.delete('/:id', listController.deleteList);
  }
}

export const listRouter = new ListRouter();
