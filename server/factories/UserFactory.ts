import UserModel, { IUser } from '../models/UserModel';

export class UserFactory {
    static getModel(): typeof UserModel {
        return UserModel;
    }
}