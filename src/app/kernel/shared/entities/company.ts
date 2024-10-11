import { IAddress } from "./address";

export class ICompany {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public address_id?: number,
        public address?: IAddress,
        public deleted_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): ICompany {
        return Object.assign(new ICompany(), jsonData);
    }
}