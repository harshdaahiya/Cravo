import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { couponRepository, CouponRepository } from '../repositories/coupon-repository.js';

export class CouponController extends BaseController {
  private couponRepo: CouponRepository;

  constructor() {
    super();
    this.couponRepo = couponRepository;
  }

  public validateCoupon = async (req: Request, res: Response) => {
    try {
      const { code, orderValue } = req.body;
      if (!code) return this.sendError(res, 'Coupon code is required', 400);

      const coupon = await this.couponRepo.findByCode(code as string);
      if (!coupon) return this.sendError(res, 'Invalid or inactive coupon', 404);

      if (orderValue < coupon.minimumOrderValue) {
        return this.sendError(res, `Minimum order value for this coupon is ${coupon.minimumOrderValue}`, 400);
      }

      if (new Date() > coupon.expiryDate) {
        return this.sendError(res, 'Coupon has expired', 400);
      }

      if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
        return this.sendError(res, 'Coupon usage limit reached', 400);
      }

      return this.sendSuccess(res, { coupon }, 'Coupon is valid');
    } catch (error: any) {
      return this.sendError(res, 'Failed to validate coupon', 500, error);
    }
  };

  public getAllCoupons = async (req: Request, res: Response) => {
    try {
      const coupons = await this.couponRepo.find({});
      return this.sendSuccess(res, { coupons }, 'Coupons retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve coupons', 500, error);
    }
  };
}

export const couponController = new CouponController();
