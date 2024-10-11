export class IImage {
    constructor(
        public id?: number,
        public path?: string,
        public size?: number,
        public original_name?: string,
        public url?: string,
        public extension?: string,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IImage {
        return Object.assign(new IImage(), jsonData);
    }
}
