import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IEntityTableFields } from '../../../../interfaces/entity';
import { MainService } from '../../../../../core/services/main.service';

@Component({
  selector: 'table-field',
  templateUrl: './table-field.component.html',
  styleUrl: './table-field.component.scss'
})
export class TableFieldComponent implements OnInit, OnDestroy{
  @Input() item: any;
  @Input() field: IEntityTableFields;
  sub: Subscription[] = [];

  loading: boolean = false;

  constructor(protected mainserv: MainService) {
    this.sub.push(
      this.mainserv.currentLoading.subscribe((ld) => {
        this.loading = ld;
      })
    );
  }

  parseValue(item) {
    if (item instanceof Array) {
      return item.length;
    } else {
      if (item instanceof Object) {
        return item.name || item.title;
      }
      return item;
    }
  }

  imageWidth() {
    return this.field.props.width ? this.field.props.width : '100%';
  }

  imageHeight() {
    return this.field.props.height ? this.field.props.height : '100%';
  }

  checkImage() {
    if (!this.item[this.field.field]) {
      return (
        'https://via.placeholder.com/' +
        this.field.props.width +
        'x' +
        this.field.props.height
      );
    } else {
      return this.item[this.field.field];
    }
  }

  ngOnInit(): void {}

  //Fim do Ciclo do Componente
  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
