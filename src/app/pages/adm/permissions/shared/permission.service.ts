import { Injectable, Injector } from '@angular/core';
import { IPermission } from '../../../../kernel/shared/entities/permission';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseResourceService<IPermission> {
  constructor(protected injector: Injector) {
    super('admin/permissions', injector, IPermission.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'permission',
        singularName: 'Permissão',
        pluralName: 'Permissões',
        singularArticle: 'a',
        pluralArticle: 'as',
        route: 'permissions',
        icon: 'privacy_tip'
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
        create: ['criar-permissoes'],
        edit: ['editar-permissoes'],
        delete: ['deletar-permissoes'],
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
