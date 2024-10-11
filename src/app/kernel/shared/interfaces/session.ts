import { IPermission } from "../entities/permission";
import { IUser } from "../entities/user";

export interface ISession {
    token: IToken;
    permissions: IPermission[];
    user: IUser;
}

export interface IToken {
    type: string;
    token: string;
    expires_at: Date
}