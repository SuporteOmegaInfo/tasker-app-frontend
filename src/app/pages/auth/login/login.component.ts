import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, Subscription } from 'rxjs';

import { MainService } from '../../../kernel/core/services/main.service';
import { BaseFormComponent } from '../../../kernel/shared/components/base/base-form/base-form.component';
import { AnimationType } from '../../../kernel/shared/components/ui/carousel/carousel.animations';
import { CarouselComponent } from '../../../kernel/shared/components/ui/carousel/carousel.component';
import { ISlide } from '../../../kernel/shared/interfaces/ui/slide';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseFormComponent implements OnInit, OnDestroy {

  animationType = AnimationType.Fade;
  animationTypes = [
    {
      name: 'Scale',
      value: AnimationType.Scale,
    },
    {
      name: 'Fade',
      value: AnimationType.Fade,
    },
    {
      name: 'Flip',
      value: AnimationType.Flip,
    },
    {
      name: 'Jack In The Box',
      value: AnimationType.JackInTheBox,
    },
  ];
  slides: ISlide[] = [
    {
      headline: '',
      src: './../../../../assets/images/example1.png',
    },
    {
      headline: '',
      src: './../../../../assets/images/example2.png',
    },
    {
      headline: '',
      src: './../../../../assets/images/example3.png',
    },
    {
      headline: '',
      src: './../../../../assets/images/example4.png',
    },
  ];
  loopingCarousel

  returnUrl: string;
  sub: Subscription[] = [];
  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  constructor(
    protected injector: Injector,
    private authService: AuthService,
    protected mainServ: MainService,
    protected router: Router
  ) {
    super(injector, mainServ);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.mainServ.currentSubmitting.subscribe((sb) => {
      this.submittingForm = sb;
    });
    if (this.authService.currentSessionValue) {
      this.router.navigate(['/']);
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    })
  }

  submit(){
    this.mainServ.toggleSubmitting(true);

    // stop here if form is invalid
    if (this.f.invalid) {
      this.mainServ.toggleSubmitting(false);
      return;
    }

    this.sub.push(
      this.authService
        .login(this.f.email.value, this.f.password.value)
        .subscribe(
          (data) => this.actionsForSuccess(data),
          (error) => this.actionsForError(error)
        )
    );
  }

  protected actionsForSuccess(data: any) {
    this.mainServ.toggleSubmitting(false);
    this.mainServ.sendToastr('success', 'Bem vindo!')
    this.router.navigate([this.returnUrl]);
  }

  protected actionsForError(error) {
    this.mainServ.toggleSubmitting(false);

    let erray: string[] = []

    if(error.status == 422){
      erray = error.error.errors.map(err => err.message)
    }

    if (error.status == 404 || error.status == 401) {
      erray.push('Usuário ou senha incorretos.')
    }else{
      erray.push(error?.error?.message)
    }

    if(typeof error == 'string'){
      erray.push(error)
    }

    erray.forEach(e => {
      if(e){
        this.mainServ.sendDefaultErrorToastr(error)
      }
    })


  }

  setAnimationType(type) {
    this.animationType = type.value;
    this.loopingCarousel = setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

  ngOnDestroy() {
    clearInterval(this.loopingCarousel);
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }

}
