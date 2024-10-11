import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { ICity } from '../interfaces/city';
import { IUF } from '../interfaces/uf';
import { ICheckbox } from '../interfaces/ui/checkbox';
import { ISelectItem } from '../interfaces/ui/select';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private http: HttpClient
  ) { }

  public transformEntityToSelectFormat(data: any[]): ISelectItem[]{

    return data.map(d => {
      return {
        label: d.name || d.title,
        value: d.id
      }
    })

  }

  public transformEntityToCheckboxFormat(data: any[]): ICheckbox[]{
    if(data && data.length > 0){
      return data.map(d => {
        return {
          label: d.name || d.title,
          value: d.id,
          checked: false
        }
      })
    }
  }

  getUfs() {
    return this.http.get<IUF[]>('assets/data/estadosbr.json');
  }

  getCities(idEstado: number) {
    return this.http.get<ICity[]>('assets/data/cidades.json')
    .pipe(
      // tslint:disable-next-line:triple-equals
      map((cidades: ICity[]) => cidades.filter(c => c.estado == idEstado))
    );
  }

  loadColors() {
    return this.http.get<any[]>('assets/data/colors.json')
    .pipe(
      map(x => x)
    )
  }
}
