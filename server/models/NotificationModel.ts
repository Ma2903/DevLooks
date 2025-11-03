import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    user: Schema.Types.ObjectId;
    message: string;
    type: 'order' | 'system' | 'promotion';
    read: boolean;
    relatedId?: string;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['order', 'system', 'promotion'],
        default: 'system'
    },
    read: { 
        type: Boolean, 
        default: false 
    },
    relatedId: {
        type: String
    }
}, { 
    timestamps: true 
});

// Índice para buscar notificações não lidas de um usuário rapidamente
NotificationSchema.index({ user: 1, read: 1 });

const NotificationModel = model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
