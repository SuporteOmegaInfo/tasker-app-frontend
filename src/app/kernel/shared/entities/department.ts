import { ICompany } from "./company";
import { IPermission } from "./permission";
import { IUser } from "./user";

export class IDepartment {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public users?: IUser[],
        public permissions?: IPermission[],
        public company_id?: number,
        public company?: ICompany,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IDepartment {
        return Object.assign(new IDepartment(), jsonData);
    }
}
