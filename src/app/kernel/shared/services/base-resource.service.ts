import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IBaseEntity } from '../interfaces/base-entity';
import { IBaseOutInsertRequest, IBaseOutListRequest } from '../interfaces/base-request';
import { environment } from '../../../../environments/environment';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ITableOptions } from '../interfaces/ui/table';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseResourceService<T extends IBaseEntity> {
  protected http: HttpClient;

  protected readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get entityOptions(): ITableOptions{
    return {
      entityData: {
        aclEntity: 'item',
        singularName: 'Item',
        pluralName: 'Items',
        singularArticle: 'o',
        pluralArticle: 'os',
        route: 'items',
      },
      tableFields: [],
      tableRuler: {
        edit: [],
        delete: [],
        extraBtnRuler: [
          {
            action: '',
            permissions: [],
          },
        ],
      }
    }
  }

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) { this.http = injector.get(HttpClient); }

  /**
   * 
   * @param filters 
   * @returns 
   */
  public getAll(filters: any): Observable<IBaseOutListRequest> {
    const filter = this.mountFilters(filters);
    //console.log(filter)

    return this.http
      .get(`${environment.apiUrl}/${this.apiPath}${filter}`, this.httpOptions)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError)
      );
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public getById(id: string | number): Observable<IBaseOutInsertRequest> {
    //console.log("Id que está indo pra API", id)
    const url = `${environment.apiUrl}/${this.apiPath}/${id}`;
    return this.http
      .get(url, this.httpOptions)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      );
  }

  /**
   * 
   * @param resource 
   * @returns 
   */
  public create(resource: T): Observable<IBaseOutInsertRequest> {
    return this.http
      .post(`${environment.apiUrl}/${this.apiPath}`, resource)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      );
  }

  /**
   * 
   * @param resource 
   * @returns 
   */
  public update(resource: T): Observable<IBaseOutInsertRequest> {
    var url = '';

    if (resource.slug) {
      url = `${environment.apiUrl}/${this.apiPath}/${resource.slug}`;
    } else {
      url = `${environment.apiUrl}/${this.apiPath}/${resource.id}`;
    }

    return this.http.put(url, resource).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public delete(id: any): Observable<any> {
    const url = `${environment.apiUrl}/${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    );
  }

  /**
   * Realiza a captação dos parâmetros vindos da página
   * e monta a queryString dos filtros para enviar na API
   * 
   * @param filters 
   * @returns 
   */
  public mountFilters(filters: any): string {
    if (!filters) {
      return '';
    }

    const keys = Object.keys(filters);

    let stringFilters = '?';

    keys.forEach((key) => {
      let item = filters[key];
      let vai: boolean = true;

      if (item == null || item == 'null') {
        vai = false;
      }

      if (typeof item == 'string') {
        if (item == '') {
          vai = false;
        }
      }
      if (typeof item == 'number') {
        if (item == null) {
          vai = false;
        }
      }
      if (typeof item == 'object') {
        if (item == null) {
          vai = false;
        } else {
          if (item.length == 0) {
            vai = false;
          }
        }
      }
      if (typeof item == 'boolean') {
        if (item == null) {
          vai = false;
        }
        if (item) {
          filters[key] = 1;
        } else {
          filters[key] = 0;
        }
      }
      if (vai) {
        stringFilters += key + '=' + filters[key] + '&';
      }
    });

    return stringFilters;
  }

  /**
   * 
   * @param jsonData 
   * @returns 
   */
  protected jsonDataToResources(
    jsonData: IBaseOutListRequest
  ): IBaseOutListRequest {
    const request = new IBaseOutListRequest();
    const resources: T[] = [];
    jsonData.data.forEach((element) =>
      resources.push(this.jsonDataToResourceFn(element))
    );
    request.data = resources;
    request.pagination = jsonData.pagination;
    request.filters = Object.keys(jsonData.filters).map(f => {
      return {
        ...jsonData.filters[f],
        value: null
      }
    });

    return request;
  }

  /**
   * 
   * @param jsonData 
   * @returns 
   */
  protected jsonDataToResource(jsonData: any): T {
    //console.log(jsonData)
    return this.jsonDataToResourceFn(jsonData);
  }

  /**
   * 
   * @param error 
   * @returns 
   */
  protected handleError(error: any): Observable<any> {
    //console.log("Erro na Requisição =>", error)
    return throwError(error);
  }
}
