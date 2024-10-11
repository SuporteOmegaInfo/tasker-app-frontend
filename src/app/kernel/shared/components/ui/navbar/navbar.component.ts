import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../../core/services/main.service';
import { INavbarItemOptions } from '../../../interfaces/ui/navbar';
import { Subscription } from 'rxjs';
import { IUser } from '../../../entities/user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy{
  @Input() navbar_items: INavbarItemOptions[] = [
    {
      items: [],
      side_items: [
        {
          label: 'Perfil',
          route: '/profile',
          type: 'route',
          icon: 'assignment_ind',
          color: 'primary',
        },
        {
          label: 'Logout',
          type: 'action',
          action: 'logout',
          icon: 'logout',
          color: 'primary',
        },
      ]
    }
  ]
  currentUser: IUser

  sub: Subscription[] = [];
  showMenu: boolean = false;
  showSidebar: boolean = false;

  constructor(
    public mainServ: MainService,
    private router: Router
  ) {
    this.currentUser = this.mainServ?.currentSession?.user
  }

  ngOnInit() {
    this.sub.push(
      this.mainServ.currentShowMenu.subscribe((show) => {
        this.showMenu = show;
      })
    );

    this.sub.push(
      this.mainServ.currentSidebarCollapsed.subscribe((show) => {
        this.showSidebar = show;
      })
    );
  }

  toggleSidebar() {
    this.mainServ.toggleSidebar();
  }

  cssButtonSidebar() {
    return {
      active: this.showSidebar,
    };
  }

  logout(){
    this.mainServ.logout()
  }

  userNameMinimalist(){
    const regex = /\b\w/g
    
    const resultArr = (this.currentUser.name).match(regex) || []

    return resultArr.map(word => word[0]).join('');
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
