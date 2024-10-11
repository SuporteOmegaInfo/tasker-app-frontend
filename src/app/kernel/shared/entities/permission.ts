import { IEntityOptions, IEntityTableFields, IEntityTableRuler } from "../interfaces/entity";
import { IDepartment } from "./department";
import { IPosition } from "./position";
import { IUser } from "./user";

export class IPermission {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public users?: IUser[],
        public positions?: IPosition[],
        public departments?: IDepartment[],
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IPermission {
        return Object.assign(new IPermission(), jsonData);
    }

}