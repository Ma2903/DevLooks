import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const WishlistSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

WishlistSchema.index({ user: 1 });

const WishlistModel = mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default WishlistModel;
