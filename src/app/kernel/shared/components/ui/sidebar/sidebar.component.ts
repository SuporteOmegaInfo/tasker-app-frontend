import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MainService } from '../../../../core/services/main.service';
import { ISidebarItem } from '../../../interfaces/ui/sidebar';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  showMenu: boolean = false;
  collapsedSidebar: boolean = true;

  sub: Subscription[] = [];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private mainServ: MainService,
    private router: Router
  ) {}

  items: ISidebarItem[] = [
    {
      label: 'Sistema',
      type: 'accordion',
      icon: 'dns',
      items: [
        {
          label: 'Área de trabalho',
          route: '/dashboard',
          type: 'route',
          permissions: ['all'],
          icon: 'dashboard',
        },
        // {
        //   label: 'Checklists',
        //   type: 'dropdown',
        //   expanded: false,
        //   permissions: ['all'],
        //   icon: 'assignment',
        //   items: [
        //     {
        //       label: 'Gerenciar templates',
        //       route: '/checklist-templates',
        //       permissions: ['visualizar-checklist-templates'],
        //       type: 'route',
        //     },
        //     {
        //       label: 'Execução checklists',
        //       route: '/checklist-executions',
        //       permissions: ['visualizar-checklist-executions'],
        //       type: 'route',
        //     },
        //   ],
        // },
      ],
    },
    {
      label: 'Administração',
      type: 'accordion',
      icon: 'settings',
      items: [
        {
          label: 'Usuários',
          route: '/users',
          type: 'route',
          permissions: ['visualizar-usuarios'],
          icon: 'manage_accounts',
        },
        {
          label: 'Unidades',
          route: '/companies',
          type: 'route',
          permissions: ['visualizar-unidades'],
          icon: 'store',
        },
        {
          label: 'Permissões',
          route: '/permissions',
          type: 'route',
          permissions: ['visualizar-permissoes'],
          icon: 'privacy_tip',
        },
        {
          label: 'Departamentos',
          route: '/departments',
          type: 'route',
          permissions: ['visualizar-departamentos'],
          icon: 'rule',
        },
        {
          label: 'Perfis',
          route: '/positions',
          type: 'route',
          permissions: ['visualizar-perfis'],
          icon: 'rule',
        },
      ],
    },
  ];

  cssCollapsedSidebar() {
    return {
      collapsed: this.collapsedSidebar,
    };
  }
  ngOnInit(): void {

    //Removendo itens do menu que não são permitidos para o usuário
    this.checkSidebarPermissions()

    //Inscrevendo no ShowMenu do MainService
    this.sub.push(
      this.mainServ.currentShowMenu.subscribe((show) => {
        this.showMenu = show
      })
    );
    //Inscrevendo no CollapsedSidebar do MainService
    this.sub.push(
      this.mainServ.currentSidebarCollapsed.subscribe((collapsed: any) => {
        this.collapsedSidebar = collapsed;
      })
    );
  }
  checkCurrentRoute(items: ISidebarItem[]) {
    const currentUrl: string = this.router.routerState.snapshot.url;

    let state: boolean = false;

    items.map((item: ISidebarItem) => {
      if (item.route && currentUrl.indexOf(item.route) == 0) {
        state = true;
      }
    });

    return state;
  }
  checkMenuDropDownActive(item: ISidebarItem) {
    if(item.items){
      return {
        active: this.checkCurrentRoute(item.items),
      };
    }

    return
  }
  checkMenuContainerDropDownActive(item: ISidebarItem) {
    if(item.items){
      return {
        visibile:
          !this.collapsedSidebar &&
          (item.expanded || this.checkCurrentRoute(item.items)),
      };
    }

    return
  }
  toggleSidebar() {
    this.mainServ.toggleSidebar();
  }
  toggleMenuContainer(parentItem: ISidebarItem, childrenItem: ISidebarItem) {
    if (childrenItem.disabled) {
      return;
    }

    if (this.collapsedSidebar) {
      this.mainServ.toggleSidebar();
    }

    const parentIndex = this.items.indexOf(parentItem);

    const itemIndex = this.items[parentIndex].items.indexOf(childrenItem);

    let item = this.items[parentIndex].items[itemIndex];

    item.expanded = !item.expanded;
  }
  navigate(route: string) {
    //console.log(route);
    this.router.navigate([route]);
  }
  hasPermissions(permissions: string[]){
    return this.mainServ.hasPermissions(permissions)
  }
  checkSidebarPermissions(): void{
    this.items = this.items.filter(x => {
      let can = false
      let permissions = []
      let itemPermissions = x.items.map((item) => item.permissions)

      x.items = x.items.filter(y => {
        return this.hasPermissions(y.permissions)
      })


      itemPermissions?.forEach(p => {
        if(p[0]){
          permissions.push(p[0])
        }
      })

      can = this.hasPermissions(permissions)

      return can
    })
  }
  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}

