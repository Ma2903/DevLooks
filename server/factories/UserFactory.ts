import User from '../models/UserModel';

export class UserFactory {
    static getModel(): User {
        return User;
    }
}