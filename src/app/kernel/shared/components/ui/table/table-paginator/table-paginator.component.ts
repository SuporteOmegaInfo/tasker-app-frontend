import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { IPagination, IPaginatorOptions } from '../../../../interfaces/entity';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
})
export class TablePaginatorComponent implements OnInit, OnDestroy {
  @Input() pagination: IPagination;
  @Input() filters: any[];
  @Input() options: IPaginatorOptions = {
    pageSizes: [20, 30, 50, 100, 200],
  };

  localFilters: any[]

  @Output('changed-pagination') changedPagination = new EventEmitter<any>(null);
  @Output('changed-filters') changedFilters = new EventEmitter<any>(null);

  @ViewChild('filtersMenu', {read: ElementRef}) filtersMenu:ElementRef;

  menuOpened: boolean = false
  sub: Subscription[] = []

  constructor(
    //private renderer: Renderer2
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   if(this.menuOpened && e.target !== this.filtersMenu.nativeElement){
    //     this.toggleMenu()
    //   }
    // })
  }

  ngOnInit(): void {}

  ngOnChanges(){
    this.localFilters = this.filters
    if(this.localFilters){
      this.sub.push(
        this.route.queryParams.subscribe(p => {
          let keys = Object.keys(p)
          keys.map(k => {
            let index = this.localFilters.map(({field}) => field).indexOf(k)
            
            if(k != 'page' && k != 'limit'){
              let item = this.localFilters[index]
              let value

              if(item.type == 'dropdown' || item.type == 'number'){
                value = parseInt(p[k])
              }else{
                value = p[k]
              }
              
              this.localFilters[index].value = value
            }
            
          })
        })
      )
    }
  }

  toggleMenu(){
    if(this.menuOpened){
      this.filtersMenu.nativeElement.classList.remove('active')
      this.menuOpened = false
    }else{
      this.filtersMenu.nativeElement.classList.add('active')
      this.menuOpened = true
    }
  }

  paginateInfo() {
    let start = 0;
    let of = 0;

    start = this.pagination.page == 1 ? 1 : this.pagination.per_page + 1;
    of =
      this.pagination.total < this.pagination.per_page
        ? this.pagination.total
        : this.pagination.per_page * this.pagination.page > this.pagination.total
        ? this.pagination.total
        : this.pagination.per_page * this.pagination.page;

    return `${start} - ${of} de ${this.pagination.total}`;
  }

  gotoPageForward() {
    //console.log('clicou', this.pagination.page);

    if (this.pagination.page <= this.pagination.last_page) {
      this.changedPagination.emit({
        page:
          this.pagination.page < this.pagination.last_page
            ? this.pagination.page + 1
            : this.pagination.page,
        limit: this.pagination.per_page,
      });
    }
  }

  gotoPageBackward() {
    //console.log('clicou', this.pagination.page)

    if (this.pagination.page >= 1) {
      this.changedPagination.emit({
        page:
          this.pagination.page > 1
            ? this.pagination.page - 1
            : this.pagination.page,
        limit: this.pagination.per_page,
      });
    }
  }

  gotoFirstPage() {
    if (this.pagination.page > 1) {
      this.changedPagination.emit({
        page: 1,
        limit: this.pagination.per_page,
      });
    }
  }

  gotoLastPage() {
    if (this.pagination.page <= this.pagination.last_page) {
      this.changedPagination.emit({
        page: this.pagination.last_page,
        limit: this.pagination.per_page,
      });
    }
  }

  changePerPage() {
    if (this.options.pageSizes.indexOf(this.pagination.per_page) >= 0) {
      this.changedPagination.emit({
        page: this.pagination.page,
        limit: this.pagination.per_page,
      });
    }
  }

  emitFilters(){

    let filters = {}

    this.localFilters.map(f=> {
      filters = {
        ...filters,
        [f.field]: f.value
      }
    })

    this.changedFilters.emit(filters)

    this.toggleMenu()
  }

  cleanFilters(){
    this.localFilters = this.filters.map((f, i) => {
      this.filters[i].value = null
      return {
        ...f,
        value: null
      }
    })
    this.emitFilters()
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }

}
