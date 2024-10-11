import { ICompany } from "./company";
import { IDepartment } from "./department";
import { IImage } from "./image";
import { IUser } from "./user";

export class IChecklistTemplate  {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public description?: string,
        public status?: string,
        public items?: IChecklistTemplateItem[],
        public department_id?: number,
        public department?: IDepartment,
        public deleted_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IChecklistTemplate {
        return Object.assign(new IChecklistTemplate(), jsonData);
    }
}

export class IChecklistTemplateItem  {
    constructor(
        public id?: number,
        public name?: string,
        public slug?: string,
        public description?: string,
        public parameters?: any | any[],
        public order?: number,
        public status?: string,
        public checklist_template_id?: number,
        public checklist_template?: IChecklistTemplate,
        public deleted_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IChecklistTemplateItem {
        return Object.assign(new IChecklistTemplateItem(), jsonData);
    }
}

export class IChecklistExecution  {
    constructor(
        public id?: number,
        public checklist_template_id?: number,
        public checklist_template?: IChecklistTemplate,
        public user_id?: number,
        public user?: IUser,
        public company_id?: number,
        public company?: ICompany,
        public status?: string,
        public steps?: IChecklistExecutionStep[],
        public start?: Date,
        public end?: Date,
        public deleted_at?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IChecklistExecution {
        return Object.assign(new IChecklistExecution(), jsonData);
    }
}

export class IChecklistExecutionStep  {
    constructor(
        public id?: number,
        public checklist_template_item_id?: number,
        public checklist_template_item?: IChecklistTemplateItem,
        public checklist_execution_id?: number,
        public checklist_execution?: IChecklistExecution,
        public anotations?: IChecklistExecutionStepAnotation[],
        public parameter_selected?: string,
        public order?: number,
        public status?: string,
        public deleted_at?: Date,
        public start?: Date,
        public end?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IChecklistExecutionStep {
        return Object.assign(new IChecklistExecutionStep(), jsonData);
    }
}

export class IChecklistExecutionStepAnotation  {
    constructor(
        public id?: number,
        public checklist_execution_step_id?: number,
        public checklist_execution_step?: IChecklistExecutionStep,
        public user_id?: number,
        public user?: IUser,
        public anotation?: string,
        public images?: IImage[],
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromJson(jsonData: any): IChecklistExecutionStepAnotation {
        return Object.assign(new IChecklistExecutionStepAnotation(), jsonData);
    }
}
