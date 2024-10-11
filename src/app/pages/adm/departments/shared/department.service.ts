import { Injectable, Injector } from '@angular/core';
import { IDepartment } from '../../../../kernel/shared/entities/department';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseResourceService<IDepartment> {
  constructor(protected injector: Injector) {
    super('admin/departments', injector, IDepartment.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'department',
        singularName: 'Departamento',
        pluralName: 'Departamentos',
        singularArticle: 'o',
        pluralArticle: 'os',
        route: 'departments',
        icon: 'rule'
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
        create: ['criar-departamentos'],
        edit: ['editar-departamentos'],
        delete: ['deletar-departamentos'],
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
