import { ICompany } from "./company";
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
        public steps?: IProjectStep[],
        public expires_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IProject {
        return Object.assign(new IProject(), jsonData);
    }
}

export class IProjectStep {
  constructor(
      public id?: number,
      public name?: string,
      public slug?: string,
      public project_id?: number,
      public project?: IProject,
      public user_id?: number,
      public author?: IUser,
      public members?: IUser[],
      public expires_at?: Date,
      public created_at?: Date,
      public updated_at?: Date
  ){}

  static fromJson(jsonData: any): IProjectStep {
      return Object.assign(new IProjectStep(), jsonData);
  }
}
