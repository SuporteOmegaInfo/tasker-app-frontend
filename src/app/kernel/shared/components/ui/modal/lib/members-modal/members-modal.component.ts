import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { MainService } from '../../../../../../core/services/main.service';
import { BaseFormComponent } from '../../../../base/base-form/base-form.component';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'members-modal',
  templateUrl: './members-modal.component.html',
  styleUrl: './members-modal.component.scss'
})
export class MembersModalComponent extends BaseFormComponent implements OnInit{

  data: any

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected modalserv: ModalService,
    protected mainServ: MainService
  ) {
    super(injector, mainServ);
    this.modalserv.getData().subscribe(
      result => {
        this.data = result

        if(this.form){
          this.data.members.map(member => {
            this.membersArray.push(new FormControl(member.user))
          })
        }
      }
    )
  }

  ngOnInit(): void {
    this.buildForm()
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      members: new FormArray([]),
    })
  }

  removeMember(index: string){

  }

  closeModal(){
    this.modalserv.close('members-project')
  }

  get membersArray(): FormArray {
    return <FormArray>this.form.controls.members;
  }

  protected submit(): void {
    throw new Error('Method not implemented.');
  }

}
