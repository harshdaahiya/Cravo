import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { productRepository, ProductRepository } from '../repositories/product-repository.js';

export class ProductController extends BaseController {
  private productRepo: ProductRepository;

  constructor() {
    super();
    this.productRepo = productRepository;
  }

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productRepo.find();
      return this.sendSuccess(res, { products }, 'Products retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve products', 500, error);
    }
  };

  public getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productRepo.findById(id as string);
      
      if (!product) {
        return this.sendError(res, 'Product not found', 404);
      }
      
      return this.sendSuccess(res, { product }, 'Product retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve product', 500, error);
    }
  };

  public getProductsByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const products = await this.productRepo.findByCategory(categoryId as string);
      return this.sendSuccess(res, { products }, 'Products for category retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve products for category', 500, error);
    }
  };
}

export const productController = new ProductController();
