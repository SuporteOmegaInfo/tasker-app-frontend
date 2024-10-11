import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() text: string = ''
  @Input() item: any
  @Output('confirmation') confirmation: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor() { }

  confirm(yesOrNo: any){
    this.confirmation.emit(yesOrNo)
  }

  ngOnInit(): void {
  }

}
