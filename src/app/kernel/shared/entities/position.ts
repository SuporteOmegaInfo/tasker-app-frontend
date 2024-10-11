import { ICompany } from "./company";
import { IDepartment } from "./department";
import { IPermission } from "./permission";
import { IUser } from "./user";

export class IPosition {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public users?: IUser[],
        public permissions?: IPermission[],
        public department_id?: number,
        public department?: IDepartment,
        public company_id?: number,
        public company?: ICompany,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IPosition {
        return Object.assign(new IPosition(), jsonData);
    }
}
