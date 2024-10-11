import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { differenceInDays, format } from 'date-fns';
import { Subscription } from 'rxjs';

import { MainService } from '../../../../kernel/core/services/main.service';
import { DashboardService } from '../shared/dashboard.service';
import { IProject } from '../../../../kernel/shared/entities/project';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  sub: Subscription[] = []
  hoveredCardIndex: number | null = null;

  /**
   *
   */
  constructor(
    protected mainServ: MainService,
    protected dashServ: DashboardService,
    protected router: Router
  ) {}

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  my_projects: any[] = []
  my_related_projects: any[] = []

  ngOnInit(): void {
    this.sub.push(
      this.dashServ.dashboard().subscribe(
        result => {
          this.my_projects = result.my_projects
          this.my_related_projects = result.my_related_projects
        },
        error => {
          this.mainServ.sendDefaultErrorToastr(error)
        }
      )
    )
  }

  public getProjectRemaining(project_final_date: string){

    let date = format(new Date(), 'yyyy-MM-dd')
    project_final_date = format(new Date(project_final_date), 'yyyy-MM-dd')

    let diff = differenceInDays(project_final_date, date)

    return diff > 0 ? diff : 0
  }

  public getRemainingProgress(project_start_date: string, project_final_date: string){
    let date = format(new Date(), 'yyyy-MM-dd')
    project_start_date = format(new Date(project_start_date), 'yyyy-MM-dd')
    project_final_date = format(new Date(project_final_date), 'yyyy-MM-dd')

    let originaldiff = differenceInDays(project_final_date, project_start_date )
    let remainingdiff = differenceInDays(project_final_date, date)
    let result = (remainingdiff/originaldiff)*100
    return result > 0 ? result : 0
  }

  public styleCardText(color: string){
    return this.getContrastYIQ(color)
  }

  public getContrastYIQ(hexcolor) {

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

  public styleCardShadow(color: string): string{
    let darkenColor = this.darkenColorPercent(color, 30)
    return `1px 1px 2px 3px ${darkenColor}`
  }

  public darkenColorPercent(hex: string, percentual: number): string {
    // Remove o "#" caso exista
    hex = hex.replace("#", "");

    // Converte hexadecimal para RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Aplica o percentual de escurecimento
    r = Math.floor(r * (1 - percentual / 100));
    g = Math.floor(g * (1 - percentual / 100));
    b = Math.floor(b * (1 - percentual / 100));

    // Garante que os valores fiquem no intervalo [0, 255]
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Converte de volta para hexadecimal
    const newColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    return newColor;
  }

  public lightenColorPercent(hex: string, percentual: number): string {
    // Remove o "#" caso exista
    hex = hex.replace("#", "");

    // Converte hexadecimal para RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Aplica o percentual de clareamento
    r = Math.floor(r + (255 - r) * (percentual / 100));
    g = Math.floor(g + (255 - g) * (percentual / 100));
    b = Math.floor(b + (255 - b) * (percentual / 100));

    // Garante que os valores fiquem no intervalo [0, 255]
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Converte de volta para hexadecimal
    const newColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    return newColor;
  }

  public onMouseEnter(index: number): void {
    this.hoveredCardIndex = index;
  }

  public onMouseLeave(): void {
    this.hoveredCardIndex = null;
  }

  protected addNewProject(project: IProject): void{
    this.my_projects.push(project)
  }

  hasPermissions(permissions: string[]): boolean{
    return this.mainServ.hasPermissions(permissions)
  }

  openProject(project: IProject): void{
    this.router.navigate([`/projects/${project.slug}`])
  }

  ngOnDestroy():void {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
