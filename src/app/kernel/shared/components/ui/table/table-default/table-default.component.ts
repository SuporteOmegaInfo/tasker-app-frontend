import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITableOptions } from '../../../../interfaces/ui/table';
import { Router } from '@angular/router';
import { ModalService } from '../../modal/modal.service';
import { MainService } from '../../../../../core/services/main.service';

@Component({
  selector: 'table-default',
  templateUrl: './table-default.component.html',
  styleUrl: './table-default.component.scss'
})
export class TableDefaultComponent {
  @Input('params') tableParams: ITableOptions
  // @Input('pagination') pagination: IPagination
  @Input('data') tableData: any[]

  itemConfirm: any

  @Output() deleteItem = new EventEmitter<any>(null)
  @Output() paginated = new EventEmitter<any>(null)
  @Output() extraBtnAction = new EventEmitter<any>(null)

  /**
   *
   */
  constructor(
    private router: Router,
    private modalServ: ModalService,
    private mainServ: MainService
    ) {}

  openEdit(data: any){

    let index

    if(data.slug){
      index = data.slug
    }else{
      index = data.id
    }

    this.router.navigate([this.tableParams.entityData.route, index ,'edit'])

  }

  openDelete(event){
    this.itemConfirm = event
    this.modalServ.open('confirm-delete')
  }

  paginate(event){
    this.paginated.emit(event)
  }

  findItemOnScaleOrNo(data, param){

    let finalItem = data

    // Item com composição do índice
    if(param.field.indexOf('.') >= 0){
      let scale = param.field.split('.')

      scale.forEach(sc => {
        finalItem = finalItem ? finalItem[sc] : null
      })

    }else{
      finalItem = finalItem[param.field]
    }

    return finalItem

  }

  confirmDelete(event){
    if(event){
      this.deleteItem.emit(this.itemConfirm)
    }

    this.modalServ.close('confirm-delete')
  }

  checkRulerExtraButton(action: string){
    let actionRuler = this.tableParams.tableRuler.extraBtnRuler.find(x => x.action == action)
    let permissions: string[] = actionRuler.permissions || []
    return this.mainServ.hasPermissions(permissions)
  }

  checkRulerEdit(){
    let permissions: string[] = this.tableParams.tableRuler.edit
    return this.mainServ.hasPermissions(permissions)
  }

  checkRulerDelete(){
    let permissions: string[] = this.tableParams.tableRuler.delete
    return this.mainServ.hasPermissions(permissions)
  }

  sendExtraButtonAction(action: string, data: any){
    this.extraBtnAction.emit({action, data})
  }
}
