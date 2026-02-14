import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  answerText?: string;
}

export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  isVerifiedBuyer: boolean;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    isVerifiedBuyer: { type: Boolean, default: false },
    questions: [
      {
        questionText: { type: String, required: true },
        answerText: { type: String },
      },
    ],
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const ReviewModel = model<IReview>('Review', ReviewSchema);
