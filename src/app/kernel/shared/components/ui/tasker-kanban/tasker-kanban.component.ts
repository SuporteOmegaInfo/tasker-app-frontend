import { Component, Injector, Input } from '@angular/core';
import { IProject, IProjectStep } from '../../../entities/project';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../pages/adm/users/shared/user.service';
import { ProjectStepService } from '../../../../../pages/client/project-steps/shared/project-step.service';
import { ProjectService } from '../../../../../pages/client/projects/shared/project.service';
import { MainService } from '../../../../core/services/main.service';
import { ModalService } from '../modal/modal.service';
import { differenceInDays, format } from 'date-fns';

@Component({
  selector: 'tasker-kanban',
  templateUrl: './tasker-kanban.component.html',
  styleUrl: './tasker-kanban.component.scss'
})
export class TaskerKanbanComponent  {

  /**
   *
   */
  constructor(
    protected mainServ: MainService,
    protected proServ: ProjectService,
    protected proStServ: ProjectStepService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected injector: Injector,
    protected modalserv: ModalService,
    protected usServ: UserService
  ) {}

  @Input() project: IProject

  sub: Subscription[] = []
  isAdding: boolean = false
  newStepName: string = ''

  //Escurece uma porcentagem definida de uma cor informada
  public darkenColorPercent(hex, percentual) {
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
  //Verifica claridade da cor e aplica uma cor de contraste preta ou branca
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
  //Clareia uma porcentagem definida de uma cor informada
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

  public createProjectStep(){
    this.mainServ.toggleSubmitting(true)
    this.sub.push(
      this.proStServ.create({ name: this.newStepName, project_id: this.project.id }).subscribe(
        result => {
          this.mainServ.sendToastr('success', 'Etapa criada com sucesso!')
          this.isAdding = false
          this.newStepName = ''
          this.project.steps.push(result.data)
          this.mainServ.toggleSubmitting(false)
        },
        error => {
          this.mainServ.sendDefaultErrorToastr(error)
          this.mainServ.toggleSubmitting(false)
        }
      )
    )
  }

  public deleteStep(step: IProjectStep){
    this.mainServ.toggleLoading(true)
    this.sub.push(
      this.proStServ.delete(step.id).subscribe(
        result => {
          this.project.steps = this.project.steps.filter(
            (element) => element != step
          )
          this.mainServ.sendToastr('success', 'Etapa excluída com sucesso!')
          this.mainServ.toggleLoading(false)
        },
        error => {
          this.mainServ.toggleLoading(false)
          this.mainServ.sendDefaultErrorToastr(error)
        }
      )
    )
  }

  cssDateSticker(step: IProjectStep){

    let diff = differenceInDays(step.expires_at, new Date())

    return {
      'badge-warning' : diff < 2,
      'badge-danger' : diff < 1,
    }
  }

  updateStepSaved(event: IProjectStep){
    let step = this.project.steps.map(({id}) => id).indexOf(event.id)
    this.project.steps[step] = event
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
