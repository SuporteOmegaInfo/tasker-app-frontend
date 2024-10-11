import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import { HelperService } from '../../../../services/helper.service';
import { ModalService } from '../../../ui/modal/modal.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'form-colorpicker',
  templateUrl: './form-colorpicker.component.html',
  styleUrl: './form-colorpicker.component.scss'
})
export class FormColorpickerComponent implements AfterViewChecked{

  colors: any[] = []

  @Input() control: FormControl
  @Input() showPrev: boolean = false
  @Output() changed = new EventEmitter<boolean>(null)

  /**
   *
   */
  constructor(
    protected hserv: HelperService,
    protected modalserv: ModalService
  ) {
    this.hserv.loadColors().subscribe(
      result => {
        this.colors = result
      }
    )
  }
  ngAfterViewChecked(): void {}

  selectColor(color: any){
    this.control.patchValue(color.color)
    this.changed.emit(true)
    this.closeModal()
  }

  getContrastYIQ(hexcolor) {

    if(hexcolor == '' || hexcolor == null){
      return
    }

    // Remove o símbolo de hashtag se presente
    hexcolor = hexcolor.replace("#", "");

    // Converte a cor de hexadecimal para RGB
    var r = parseInt(hexcolor.substring(0, 2), 16);
    var g = parseInt(hexcolor.substring(2, 4), 16);
    var b = parseInt(hexcolor.substring(4, 6), 16);

    // Calcula o valor de YIQ para determinar se a cor é clara ou escura
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Se o valor de YIQ for maior que 128, a cor é clara, então o contraste será preto
    // Caso contrário, o contraste será branco
    return yiq >= 128 ? '#495057' : '#fff';
  }

  openModal(){
    this.modalserv.open('colorpicker')
  }

  closeModal(){
    this.modalserv.close('colorpicker')
  }
}
