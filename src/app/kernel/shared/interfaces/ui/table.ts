import { IEntityOptions, IEntityTableFields, IEntityTableRuler, IExtraTableButton } from "../entity";

export interface ITableOptions{
    entityData: IEntityOptions;
    tableFields: IEntityTableFields[];
    tableRuler: IEntityTableRuler;
    extraButtons?: IExtraTableButton[];
}