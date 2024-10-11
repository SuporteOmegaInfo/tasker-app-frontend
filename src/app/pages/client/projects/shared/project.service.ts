import { Injectable, Injector } from '@angular/core';

import { IProject } from '../../../../kernel/shared/entities/project';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseResourceService<IProject>{

  constructor(protected injector: Injector) {
    super('admin/projects', injector, IProject.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'project',
        singularName: 'Projeto',
        pluralName: 'Projetos',
        singularArticle: 'o',
        pluralArticle: 'os',
        route: 'projects',
        icon: 'tactic'
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
        create: ['criar-projetos'],
        edit: ['editar-projetos'],
        delete: ['deletar-projetos'],
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
