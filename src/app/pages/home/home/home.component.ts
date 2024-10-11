import { Component, OnInit } from '@angular/core';
import { differenceInDays, format } from 'date-fns';

import { MainService } from '../../../kernel/core/services/main.service';
import { IBreadcrumb } from '../../../kernel/shared/interfaces/ui/breadcrumb';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    aspectRatio: 1,
    handleWindowResize: true
  };

  /**
   *
   */
  constructor(
    protected mainServ: MainService
  ) {}

  ngOnInit(): void {
  }

  getProjectRemaining(project_final_date: string){

    let date = format(new Date(), 'yyyy-MM-dd')
    project_final_date = format(new Date(project_final_date), 'yyyy-MM-dd')

    let diff = differenceInDays(project_final_date, date)

    return diff > 0 ? diff : 0
  }

  getRemainingProgress(project_start_date: string, project_final_date: string){
    let date = format(new Date(), 'yyyy-MM-dd')
    project_start_date = format(new Date(project_start_date), 'yyyy-MM-dd')
    project_final_date = format(new Date(project_final_date), 'yyyy-MM-dd')

    let originaldiff = differenceInDays(project_start_date, project_final_date)
    let remainingdiff = differenceInDays(date, project_final_date)
    let result = (remainingdiff/originaldiff)*100
    return result > 0 ? result : 0
  }

}
