import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../modal.service';
import { MainService } from '../../../../../../core/services/main.service';
import { IChecklistExecutionStepAnotation } from '../../../../../entities/checklist';

@Component({
  selector: 'add-anotation-modal',
  templateUrl: './add-anotation-modal.component.html',
  styleUrl: './add-anotation-modal.component.scss'
})
export class AddAnotationModalComponent implements OnInit{

  @Output() returnResult = new EventEmitter<string>(null)
  anotation: IChecklistExecutionStepAnotation = {
    id: null,
    checklist_execution_step_id: null,
    user_id: null,
    images: []
  }

  /**
   *
   */
  constructor(
    protected mainServ: MainService, 
    private modalServ: ModalService
    ) {}

  newAnotation: string = ""
  newImages: any

  ngOnInit(){

    this.modalServ.getData().subscribe(
      result => {
        console.log(result)
        this.anotation = result
        // if(this.anotation.images && Array.isArray(this.anotation.images) && this.anotation.images.length > 0){

        // }
      },
      error => {
        this.mainServ.sendDefaultErrorToastr(error)
      }
    )
  }

  close(){
    this.modalServ.clearData()
    this.modalServ.close('add-anotation')
  }

  send(){
    this.returnResult.next(this.newAnotation)
    this.close()
  }

}
