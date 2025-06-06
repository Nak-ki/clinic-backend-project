import { IUser } from "../interfaces/user.interface";

class UserPresenter {
    public publicResDTO(user: IUser): Partial<IUser> {
        return {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            role: user.role,
            email: user.email,
        };
    }
}

export const userPresenter = new UserPresenter();
