import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'form-text-to-input',
  templateUrl: './form-text-to-input.component.html',
  styleUrl: './form-text-to-input.component.scss'
})
export class FormTextToInputComponent implements OnInit{

  ngOnInit(): void {
    this.lastValue = this.text
  }

  @Input() text: string;
  @Output() textChange = new EventEmitter<string>();
  @Output() textChanged = new EventEmitter<any>();
  @ViewChild('inp') inp: ElementRef
  lastValue: string = ''

  isEdditingStepName: boolean = false

  focusOut(){
    this.isEdditingStepName = false
  }

  goToEditting(){
    this.isEdditingStepName = true
    setTimeout(() => {
      this.inp.nativeElement.focus()
    }, 50);
  }

  onChange(){
    this.textChanged.emit({
      newText: this.text,
      oldText: this.lastValue
    })
  }
}
