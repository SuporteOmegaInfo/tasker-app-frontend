import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[scrollHeader]',
})
export class ScrollHeaderDirective {

  maxScroll: number = 140

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > this.maxScroll) {
      this.renderer.addClass(this.el.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
    }
  }

}
