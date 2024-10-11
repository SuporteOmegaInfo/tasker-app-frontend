import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainService } from './kernel/core/services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  showMenu: boolean = false;
  sub: Subscription[] = [];
  sidebarCollapsed: boolean = false;
  //ld: boolean = false;

  loading: boolean = true;

  constructor(
    public mainServ: MainService,
  ) {}

  ngOnInit(): void {
    this.sub.push(
      this.mainServ.currentShowMenu.subscribe((show) => (this.showMenu = show))
    );
    this.sub.push(
      this.mainServ.currentSidebarCollapsed.subscribe(
        (show) => (this.sidebarCollapsed = show)
      )
    );
  }

  ngAfterViewInit(){
    this.mainServ.currentLoading.subscribe((ld) => {
      setTimeout(() => {
        this.loading = ld; // Atualiza a propriedade após a visualização ter sido inicializada
      });
    });
  }

  cssPageContentAdjust(){
    if(this.showMenu){
      return {
        'margin-left': this.sidebarCollapsed ? this.mainServ.isMobile() ? '0px' : '70px' : '270px',
        'margin-top': '70px',
        'height': 'calc(100vh - 70px)',
      }
    }else{
      return {
        'margin-left': '0px',
        'margin-top': '0px',
        'height': '100vh',
      }
    }
    
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
