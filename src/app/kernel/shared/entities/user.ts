import { ICompany } from "./company";
import { IDepartment } from "./department";
import { IPermission } from "./permission";
import { IPosition } from "./position";

export class IUser {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public email?: string,
        public remember_me_token?: string,
        public position_id?: number,
        public position?: IPosition,
        public department_id?: number,
        public department?: IDepartment,
        public company_id?: number,
        public company?: ICompany,
        public permissions?: IPermission[],
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IUser {
        return Object.assign(new IUser(), jsonData);
    }
}
