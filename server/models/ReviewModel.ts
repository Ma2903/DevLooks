import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    image?: string;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
});

// Garante que um usuário só possa fazer uma avaliação por produto
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);

export default ReviewModel;
