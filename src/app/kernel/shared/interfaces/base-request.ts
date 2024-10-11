export class IBaseOutListRequest {
    constructor(
        public data?: any[],
        public filters?: any[],
        public pagination?: IPaginationData
    ) { }

    static fromJson(jsonData: any): IBaseOutListRequest {
        return Object.assign(new IBaseOutListRequest(), jsonData);
    }
}

export class IBaseOutInsertRequest {
    constructor(
        public data?: any,
        public message?: string,
        public errors?: any[]
    ) { }

    static fromJson(jsonData: any): IBaseOutInsertRequest {
        return Object.assign(new IBaseOutInsertRequest(), jsonData);
    }
}

export class IPaginationData {
    constructor(
        public total?: number,
        public perPage?: number,
        public page?: number,
        public lastpage?: number
    ) { }

    static fromJson(jsonData: any): IPaginationData {
        return Object.assign(new IPaginationData(), jsonData);
    }
}
