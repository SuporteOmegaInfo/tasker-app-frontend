export interface IEntityOptions {
    singularName?: string,
    pluralName?: string,
    aclEntity?: string,
    rolesEntity?: string[],
    singularArticle?: string,
    pluralArticle?: string,
    icon?: string,
    route?: string
}

export interface IEntityTableFields {
    name?: string,
    field?: string,
    classField?: string,
    type?: string,
    props?: any[] | any,
}

export interface IEntityTableRuler {
    create?: string[],
    edit?: string[],
    delete?: string[],
    extraBtnRuler?: IEntityExtraBtnTableRuler[],
}

export interface IEntityExtraBtnTableRuler{
    action: string,
    permissions: string[]
}

export interface IExtraTableButton{
  action: string,
  icon: string,
  label: string
}

export class IPaginatorOptions{
  public pageSizes?: number[]
}

export class IPagination{
  public page: number
  public per_page: number
  public last_page: number
  public total: number
}

export class IPaginationOut{
  public page: number
  public limit: number
}
