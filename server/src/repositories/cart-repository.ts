import { ICart, CartModel } from '../models/cart-model.js';
import { BaseRepository } from './base-repository.js';

export class CartRepository extends BaseRepository<ICart> {
  constructor() {
    super(CartModel);
  }

  public async findByUser(userId: string): Promise<ICart | null> {
    return await this.findOne({ user: userId });
  }

  public async findBySession(sessionId: string): Promise<ICart | null> {
    return await this.findOne({ sessionId });
  }

  public async clearCart(cartId: string): Promise<ICart | null> {
    return await this.update(cartId, { items: [], totalPrice: 0, totalQuantity: 0 });
  }
}

export const cartRepository = new CartRepository();
