import { addressController } from '../controllers/address-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class AddressRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);

    this.router.get('/', addressController.getAllAddresses);
    this.router.get('/:id', addressController.getAddressById);
    this.router.post('/', addressController.createAddress);
    this.router.patch('/:id', addressController.updateAddress);
    this.router.delete('/:id', addressController.deleteAddress);
  }
}

export const addressRouter = new AddressRouter();
