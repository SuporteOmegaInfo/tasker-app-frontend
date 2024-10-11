import { ICompany } from "./company";
import { IDepartment } from "./department";
import { IPermission } from "./permission";
import { IUser } from "./user";

export class IProject {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public color?: string,
        public company_id?: number,
        public company?: ICompany[],
        public user_id?: number,
        public author?: IUser,
        public members?: IUser[],
        public expires_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IProject {
        return Object.assign(new IProject(), jsonData);
    }
}
