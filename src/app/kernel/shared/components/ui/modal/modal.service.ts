import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ModalService {

  private modals: any[] = [];
  private data = new BehaviorSubject<any>(null)

  getData(){
    return this.data.asObservable()
  }

  setData(data: any){
    this.data.next(data)
  }

  clearData(){
    this.data.next(null)
  }

  add(modal: any) {
      // add modal to array of active modals
      this.modals.push(modal);
  }

  remove(id: string) {
      // remove modal from array of active modals
      this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
      // open modal specified by id
      const modal = this.modals.find(x => x.id === id);
      modal.open();
  }

  close(id: string) {
      // close modal specified by id
      const modal = this.modals.find(x => x.id === id);
      modal.close();
  }

  modalList(){
    return this.modals.map(({el}) => el)
  }

}