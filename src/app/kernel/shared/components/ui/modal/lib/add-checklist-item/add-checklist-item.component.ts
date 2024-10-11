import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IChecklistTemplateItem } from '../../../../../entities/checklist';

@Component({
  selector: 'app-add-checklist-item',
  templateUrl: './add-checklist-item.component.html',
  styleUrl: './add-checklist-item.component.scss'
})
export class AddChecklistItemComponent {

  showContent: boolean = false

  @Input() item?: IChecklistTemplateItem = {
    name: null,
    description: null,
    parameters: [],
    status: 'active',
  }

  @Output('submitted') submitted: EventEmitter<IChecklistTemplateItem> = new EventEmitter<IChecklistTemplateItem>()
  @Output('updated') updated: EventEmitter<IChecklistTemplateItem> = new EventEmitter<IChecklistTemplateItem>()

  addParameter(){
    this.item.parameters.push({
      value: null
    })
  }

  removeParameter(i){
    this.item.parameters.splice(i, 1)
  }

  emitSubmitted(){
    this.submitted.emit(this.item)
  }

}
