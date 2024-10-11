import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ResourceFormComponent } from '../../../../kernel/shared/components/base/resource-form/resource-form.component';
import { ICompany } from '../../../../kernel/shared/entities/company';
import { FormArray, Validators } from '@angular/forms';
import { CompanyService } from '../shared/company.service';
import { MainService } from '../../../../kernel/core/services/main.service';
import { distinctUntilChanged, switchMap, map, startWith, Observable, skip, tap } from 'rxjs';
import { ICity } from '../../../../kernel/shared/interfaces/city';
import { HelperService } from '../../../../kernel/shared/services/helper.service';
import { CepService } from '../../../../kernel/shared/services/cep.service';
import { IUF } from '../../../../kernel/shared/interfaces/uf';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent extends ResourceFormComponent<ICompany> implements OnInit, OnDestroy{

  ufs: IUF[] = []
  cities: ICity[] = []
  filteredOptions: Observable<string[]>;
  options: string[] = [];

  /**
   *
   */
  constructor(
    protected service: CompanyService,
    protected injector: Injector,
    protected mainServ: MainService,
    protected helpServ: HelperService,
    protected cepService: CepService
  ) {
    super(service, injector, mainServ);
    this.buildForm()
  }

  jsonDataToResourceFn = ICompany.fromJson;

  ngOnInit(): void {
    super.ngOnInit()
    this.helpServ.getUfs().subscribe(ufs => this.ufs = ufs)
  }
  //Método de construção do formulário
  protected buildForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      address: this.formBuilder.group({
        street: [null, [Validators.maxLength(255)]],
        number: [null, [Validators.maxLength(7)]],
        complement: [null, [Validators.maxLength(100)]],
        district: [null, [Validators.maxLength(255)]],
        city: [null, [Validators.maxLength(255)]],
        uf: [null, [Validators.maxLength(2)]],
        zipcode: [null, [Validators.maxLength(10)]],
      }),
    })

    this.formChanges()
    
  }
  //Método para o Bind do Formulário quando em Edição de Entidade
  protected bindFormData(resource: ICompany): void {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/

    //Bind para popular formulario
    this.form.patchValue(resource);

    //Loop para popular o formArray com as Roles (deve ser executado após o Bind dos demais dados do Formulário)
    this.patchSystemAddress(resource.address)
    this.mainServ.toggleLoading(false);
  }
  //Método de transformação dos dados para Submit do formulário
  protected bindFormDataToSubmit() {
    //Instanciando os dados do Formulário
    let formData = this.form.value;

    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica para o Submit*/

    return formData;
  }
  private _filter(value: string): string[] {
    const filterValue = value?.toLowerCase() || '';

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  protected formChanges(){
    this.sub.push(
      this.form
      .get('address.zipcode')
      .valueChanges.pipe(
        skip(this.currentAction == 'new' ? 0 : 2),
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap((value) =>
          value.length == 8
            ? this.cepService.consultaCEP(
                this.getField('address.zipcode').value
              )
            : []
        )
      )
      .subscribe((data) => {
        data ? super.patchAddress(data) : {};
        //console.log("CEP data", data)
      })
    )

    this.sub.push(
      this.form
      .get('address.uf')
      .valueChanges.pipe(
        //tap(uf => console.log('Novo estado: ', uf)),
        map((uf) => this.ufs.filter((e) => e.sigla === uf)),
        map((uf) => (uf && uf.length > 0 ? uf[0].id : [])),
        switchMap((ufId: number) => this.helpServ.getCities(ufId))
        //tap(console.log)
      )
      .subscribe((cities: ICity[]) => {
        this.cities = cities;
        this.options = cities.map(({ nome }) => nome);
        //console.log(cities.map(({nome}) => nome))
      })
    )

    this.filteredOptions = this.getField('address.city').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    )
  }

  /* MÉTODOS DE CHAMADA
  Os Métodos abaixo são executados mediante Chamada no código
  */
  //Fim do Ciclo do Componente
  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }

}

