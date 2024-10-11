import { Component, Input } from '@angular/core';
import { IBreadcrumb } from '../../../interfaces/ui/breadcrumb';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
  ]
}
