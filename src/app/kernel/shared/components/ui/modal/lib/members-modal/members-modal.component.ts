import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { UserService } from '../../../../../../../pages/adm/users/shared/user.service';
import { MainService } from '../../../../../../core/services/main.service';
import { IUser } from '../../../../../entities/user';
import { BaseFormComponent } from '../../../../base/base-form/base-form.component';
import { ModalService } from '../../modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'members-modal',
  templateUrl: './members-modal.component.html',
  styleUrl: './members-modal.component.scss'
})
export class MembersModalComponent implements OnInit{

  users: IUser[] = []

  @Input() data: FormArray
  @Output() changed: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  /**
   *
   */
  constructor(
    protected modalserv: ModalService,
    protected mainServ: MainService,
    protected usServ: UserService
  ) {
  }

  ngOnInit(): void {
    this.loadMembers()
  }

  public addMember(member: IUser){
    if(this.data.value.map(({id}) => id).indexOf(member.id) < 0){
      this.data.push(new FormControl(member))
      this.data.markAsDirty()
    }
  }

  public removeMember(index: number){
    if(this.data.value[index]){
      this.data.removeAt(index)
      this.data.markAsDirty()
    }
  }

  public closeModal(){
    this.modalserv.close('members-project')
  }

  protected loadMembers(filters?: any){
    this.users = []
    this.usServ.getMembers({page: 1, limit: 10000}).forEach(
      result => {
        this.users = result.data.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }
    )
  }

  public usersAvailableToAdd(){
    if(this.data.value && this.data.value.length > 0){
      return this.users.filter(x => this.data.value.map(({id}) => id).indexOf(x.id) < 0)
    }else{
      return this.users
    }
  }

}
