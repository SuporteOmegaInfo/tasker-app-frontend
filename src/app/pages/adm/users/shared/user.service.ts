import { Injectable, Injector } from '@angular/core';

import { IUser } from '../../../../kernel/shared/entities/user';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { BaseResourceService } from '../../../../kernel/shared/services/base-resource.service';
import { environment } from '../../../../../environments/environment';
import { Observable, map, catchError } from 'rxjs';
import { IBaseOutListRequest } from '../../../../kernel/shared/interfaces/base-request';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService<IUser> {
  constructor(protected injector: Injector) {
    super('admin/users', injector, IUser.fromJson);
  }

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'user',
        singularName: 'Usuário',
        pluralName: 'Usuários',
        singularArticle: 'o',
        pluralArticle: 'os',
        route: 'users',
        icon: 'manage_accounts'
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
          name: 'E-mail',
          field: 'email',
          classField: '',
          type: 'text',
          props: [],
        },
        {
          name: 'Unidade',
          field: 'company.name',
          classField: '',
          type: 'text',
          props: [],
        },
        // {
        //   name: 'Departamento',
        //   field: 'department.name',
        //   classField: '',
        //   type: 'text',
        //   props: [],
        // },
        // {
        //   name: 'Perfil',
        //   field: 'position.name',
        //   classField: '',
        //   type: 'text',
        //   props: [],
        // },
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
        create: ['criar-usuarios'],
        edit: ['editar-usuarios'],
        delete: ['deletar-usuarios'],
        extraBtnRuler: [
          {
            action: '',
            permissions: [],
          },
        ],
      }
    }
  }

  /**
   *
   * @param filters
   * @returns
   */
  public getMembers(filters?: any): Observable<IBaseOutListRequest> {
    const filter = this.mountFilters(filters);
    //console.log(filter)

    return this.http
      .get(`${environment.apiUrl}/admin/members${filter}`, this.httpOptions)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError)
      );
  }
}
