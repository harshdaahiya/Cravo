import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { cartRepository, CartRepository } from '../repositories/cart-repository.js';
import { productRepository } from '../repositories/product-repository.js';
import { ICart } from '../models/cart-model.js';

export class CartController extends BaseController {
  private cartRepo: CartRepository;

  constructor() {
    super();
    this.cartRepo = cartRepository;
  }

  private recalculateCartTotals(cart: ICart): void {
    let newTotalPrice = 0;
    let newTotalQuantity = 0;

    for (const item of cart.items) {
      // In a real app, we'd want to ensure price is fresh from Product model if needed
      newTotalPrice += item.price * item.quantity;
      newTotalQuantity += item.quantity;
    }

    cart.totalPrice = newTotalPrice;
    cart.totalQuantity = newTotalQuantity;
  }

  public getCart = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      if (!userId) return this.sendError(res, 'Unauthorized', 401);

      const cart = await this.cartRepo.findOne(
        { user: userId },
        { 
          path: 'items.product',
          populate: { path: 'restaurant', select: 'name' }
        }
      );
      
      if (!cart) {
        return this.sendSuccess(res, { cart: { items: [], totalPrice: 0, totalQuantity: 0 } }, 'Cart is empty');
      }

      return this.sendSuccess(res, { cart }, 'Cart items retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve cart', 500, error);
    }
  };

  public addItem = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const { productId, quantity = 1, customizations = [] } = req.body;

      if (!productId) return this.sendError(res, 'Product ID is required', 400);

      const product = await productRepository.findById(productId);
      if (!product) return this.sendError(res, 'Product not found', 404);

      let cart = await this.cartRepo.findOne({ user: userId });
      if (!cart) {
        cart = await this.cartRepo.create({ user: userId, items: [] } as any);
      }

      const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].customizations = customizations;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
          customizations,
          addedAt: new Date()
        } as any);
      }

      this.recalculateCartTotals(cart);
      await cart.save();

      // Populate before sending back
      const populatedCart = await cart.populate({
        path: 'items.product',
        populate: { path: 'restaurant', select: 'name' }
      });

      return this.sendSuccess(res, { cart: populatedCart }, 'Item added to cart successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to add item to cart', 500, error);
    }
  };

  public updateQuantity = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== 'number' || quantity < 0) {
        return this.sendError(res, 'Valid quantity required', 400);
      }

      const cart = await this.cartRepo.findOne({ user: userId });
      if (!cart) return this.sendError(res, 'Cart not found', 404);

      const itemIndex = cart.items.findIndex(item => (item as any)._id.toString() === itemId);
      if (itemIndex === -1) return this.sendError(res, 'Item not found in cart', 404);

      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      this.recalculateCartTotals(cart);
      await cart.save();

      const populatedCart = await cart.populate({
        path: 'items.product',
        populate: { path: 'restaurant', select: 'name' }
      });

      return this.sendSuccess(res, { cart: populatedCart }, 'Cart updated successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to update cart', 500, error);
    }
  };

  public removeItem = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const { itemId } = req.params;

      const cart = await this.cartRepo.findOne({ user: userId });
      if (!cart) return this.sendError(res, 'Cart not found', 404);

      const itemIndex = cart.items.findIndex(item => (item as any)._id.toString() === itemId);
      if (itemIndex === -1) return this.sendError(res, 'Item not found in cart', 404);

      cart.items.splice(itemIndex, 1);

      this.recalculateCartTotals(cart);
      await cart.save();

      const populatedCart = await cart.populate({
        path: 'items.product',
        populate: { path: 'restaurant', select: 'name' }
      });

      return this.sendSuccess(res, { cart: populatedCart }, 'Item removed from cart successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to remove item from cart', 500, error);
    }
  };

  public clearCart = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const cart = await this.cartRepo.findOne({ user: userId });
      if (!cart) return this.sendError(res, 'Cart not found', 404);

      await this.cartRepo.clearCart(cart._id as string);
      
      return this.sendSuccess(res, {}, 'Cart cleared successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to clear cart', 500, error);
    }
  };
}

export const cartController = new CartController();
