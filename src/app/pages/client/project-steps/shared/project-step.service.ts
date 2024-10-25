import { Injectable, Injector } from '@angular/core';
import { IProjectStep } from '../../../../kernel/shared/entities/project';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';

@Injectable({
  providedIn: 'root'
})
export class ProjectStepService extends BaseResourceService<IProjectStep>{

  constructor(protected injector: Injector) {
    super('admin/project-steps', injector, IProjectStep.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'project_step',
        singularName: 'Etapa de Projeto',
        pluralName: 'Etapa de Projetos',
        singularArticle: 'a',
        pluralArticle: 'as',
        route: 'project_steps',
        icon: 'settings_input_component'
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
        create: ['criar-etapas-de-projetos'],
        edit: ['editar-etapas-de-projetos'],
        delete: ['deletar-etapas-de-projetos'],
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
