import { Injectable, Injector } from '@angular/core';
import { ICompany } from '../../../../kernel/shared/entities/company';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseResourceService<ICompany> {
  constructor(protected injector: Injector) {
    super('admin/companies', injector, ICompany.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'company',
        singularName: 'Unidade',
        pluralName: 'Unidades',
        singularArticle: 'a',
        pluralArticle: 'as',
        route: 'companies',
        icon: 'store'
      },
      tableFields: [
        {
          name: '#',
          field: 'id',
          classField: '',
          type: 'text',
          props: [],
        },
        {
          name: 'Nome',
          field: 'name',
          classField: '',
          type: 'text',
          props: [],
        },
        {
          name: 'Cidade',
          field: 'address.city',
          classField: '',
          type: 'text',
          props: [],
        },
        {
          name: 'UF',
          field: 'address.uf',
          classField: '',
          type: 'text',
          props: [],
        },
        {
          name: 'Data de criação',
          field: 'created_at',
          classField: '',
          type: 'date-full',
          props: {
            ifnull: 'Não informado'
          },
        },
      ],
      tableRuler: {
        create: ['criar-unidades'],
        edit: ['editar-unidades'],
        delete: ['deletar-unidades'],
        extraBtnRuler: [
          {
            action: '',
            permissions: [],
          },
        ],
      }
    }
  }
}
