import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'component-slider',
  templateUrl: './component-slider.component.html',
  styleUrl: './component-slider.component.scss'
})
export class ComponentSliderComponent implements OnInit, AfterContentInit, OnDestroy  {

  @Input() formChangeMessage: Observable<boolean>
  slides
  currentSlideIndex = 0;
  private observer: MutationObserver;
  sub: Subscription[] = []

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.sub.push(
      this.formChangeMessage.subscribe(r => this.currentSlideIndex = 0)
    )
  }

  ngAfterContentInit() {
    this.observeDOMChanges();
  }

  nextSlide() {
    if(this.currentSlideIndex < this.slides.length-1){
      this.currentSlideIndex++
      this.showSlide(this.currentSlideIndex);
    }
  }

  prevSlide() {
    if(this.currentSlideIndex > 0){
      this.currentSlideIndex--
      this.showSlide(this.currentSlideIndex);
    }
  }

  getAndMountSlides(){
    this.slides =  this.el.nativeElement.querySelectorAll('.slide-item');
    this.showSlide(this.currentSlideIndex);
  }

  private observeDOMChanges() {
    this.observer = new MutationObserver(() => {
      this.getAndMountSlides()
    });

    // Configurações do MutationObserver
    const config = { attributes: true, childList: true, subtree: true };

    // Começa a observar as mudanças no DOM dentro do elemento filho
    this.observer.observe(this.el.nativeElement, config);
  }

  private showSlide(index: number): void {
    this.slides.forEach((slide, i) => {
      this.renderer.setStyle(slide, 'display', i == index ? 'block' : 'none');
    });
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
