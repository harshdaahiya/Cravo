import { ICoupon, CouponModel } from '../models/coupon-model.js';
import { BaseRepository } from './base-repository.js';

export class CouponRepository extends BaseRepository<ICoupon> {
  constructor() {
    super(CouponModel);
  }

  public async findByCode(code: string): Promise<ICoupon | null> {
    return await this.findOne({ code: code.toUpperCase(), isActive: true });
  }

  public async incrementUsage(couponId: string): Promise<void> {
    await this.model.findByIdAndUpdate(couponId, { $inc: { timesUsed: 1 } });
  }
}

export const couponRepository = new CouponRepository();
