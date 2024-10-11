export class IAddress {
    constructor(
        public id?: number,
        public street?: string,
        public number?: string,
        public complement?: string,
        public district?: string,
        public city?: string,
        public uf?: string,
        public zipcode?: string,
        public deleted_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IAddress {
        return Object.assign(new IAddress(), jsonData);
    }
}