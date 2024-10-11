import { Injectable, Injector } from '@angular/core';

import { IPosition } from '../../../../kernel/shared/entities/position';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class PositionService extends BaseResourceService<IPosition> {
  constructor(protected injector: Injector) {
    super('admin/positions', injector, IPosition.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'position',
        singularName: 'Perfil',
        pluralName: 'Perfis',
        singularArticle: 'o',
        pluralArticle: 'os',
        route: 'positions',
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
          name: 'Departamento',
          field: 'department.name',
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
        create: ['criar-perfis'],
        edit: ['editar-perfis'],
        delete: ['deletar-perfis'],
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
