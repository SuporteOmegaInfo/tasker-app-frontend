import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { ModalService } from '../modal.service';

@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: string = '';
    @Input() cssClass: string = '';
    @Input() clickClose: boolean = true;
    private element: any;

    constructor(
      private modalService: ModalService,
      private el: ElementRef
    ) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {

        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', (el: any) => {
            if (el.target.className === 'app-modal') {
              if(this.clickClose){
                this.close();
              }
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('app-modal-open');
        const a = this.modalService.modalList()
        a.map(b => {
            if(b.nativeElement.id == this.element.id){

                const modalBody = document.querySelector(`#${b.nativeElement.id} .app-modal .app-modal-body`)
                const modalBackground = document.querySelector(`#${b.nativeElement.id} .app-modal-background`)

                modalBackground?.classList.remove('rodal-fade-leave')
                modalBackground?.classList.add('rodal-fade-enter')

                if(this.cssClass.indexOf('zoom-modal') >= 0){
                    modalBody?.classList.add('rodal-zoom-enter')
                    modalBody?.classList.remove('rodal-zoom-leave')
                }

                if(this.cssClass.indexOf('fade-modal') >= 0){
                    modalBody?.classList.add('rodal-fade-enter')
                    modalBody?.classList.remove('rodal-fade-leave')
                }

                if(this.cssClass.indexOf('flip-modal') >= 0){
                    modalBody?.classList.add('rodal-flip-enter')
                    modalBody?.classList.remove('rodal-flip-leave')
                }

                if(this.cssClass.indexOf('door-modal') >= 0){
                    modalBody?.classList.add('rodal-door-enter')
                    modalBody?.classList.remove('rodal-door-leave')
                }

                if(this.cssClass.indexOf('rotate-modal') >= 0){
                    modalBody?.classList.add('rodal-rotate-enter')
                    modalBody?.classList.remove('rodal-rotate-leave')
                }

                if(this.cssClass.indexOf('slideUp-modal') >= 0){
                    modalBody?.classList.add('rodal-slideUp-enter')
                    modalBody?.classList.remove('rodal-slideUp-leave')
                }

                if(this.cssClass.indexOf('slideDown-modal') >= 0){
                    modalBody?.classList.add('rodal-slideDown-enter')
                    modalBody?.classList.remove('rodal-slideDown-leave')
                }

                if(this.cssClass.indexOf('slideLeft-modal') >= 0){
                    modalBody?.classList.add('rodal-slideLeft-enter')
                    modalBody?.classList.remove('rodal-slideLeft-leave')
                }

                if(this.cssClass.indexOf('slideRight-modal') >= 0){
                    modalBody?.classList.add('rodal-slideRight-enter')
                    modalBody?.classList.remove('rodal-slideRight-leave')
                }

            }
        })
    }

    // close modal
    close(): void {
        const a = this.modalService.modalList()
        a.map(b => {
            if(b.nativeElement.id == this.element.id){

                const modalBody = document.querySelector(`#${b.nativeElement.id} .app-modal .app-modal-body`)
                const modalBackground = document.querySelector(`#${b.nativeElement.id} .app-modal-background`)

                modalBackground?.classList.remove('rodal-fade-enter')
                modalBackground?.classList.add('rodal-fade-leave')

                if(this.cssClass.indexOf('zoom-modal') >= 0){
                    modalBody?.classList.remove('rodal-zoom-enter')
                    modalBody?.classList.add('rodal-zoom-leave')
                }

                if(this.cssClass.indexOf('fade-modal') >= 0){
                    modalBody?.classList.remove('rodal-fade-enter')
                    modalBody?.classList.add('rodal-fade-leave')
                }

                if(this.cssClass.indexOf('flip-modal') >= 0){
                    modalBody?.classList.remove('rodal-flip-enter')
                    modalBody?.classList.add('rodal-flip-leave')
                }

                if(this.cssClass.indexOf('door-modal') >= 0){
                    modalBody?.classList.remove('rodal-door-enter')
                    modalBody?.classList.add('rodal-door-leave')
                }

                if(this.cssClass.indexOf('rotate-modal') >= 0){
                    modalBody?.classList.remove('rodal-rotate-enter')
                    modalBody?.classList.add('rodal-rotate-leave')
                }

                if(this.cssClass.indexOf('slideUp-modal') >= 0){
                    modalBody?.classList.remove('rodal-slideUp-enter')
                    modalBody?.classList.add('rodal-slideUp-leave')
                }

                if(this.cssClass.indexOf('slideDown-modal') >= 0){
                    modalBody?.classList.remove('rodal-slideDown-enter')
                    modalBody?.classList.add('rodal-slideDown-leave')
                }

                if(this.cssClass.indexOf('slideLeft-modal') >= 0){
                    modalBody?.classList.remove('rodal-slideLeft-enter')
                    modalBody?.classList.add('rodal-slideLeft-leave')
                }

                if(this.cssClass.indexOf('slideRight-modal') >= 0){
                    modalBody?.classList.remove('rodal-slideRight-enter')
                    modalBody?.classList.add('rodal-slideRight-leave')
                }

            }
        })
        setTimeout(() => {
            this.element.style.display = 'none';
            document.body.classList.remove('app-modal-open');
        }, 400);
    }
}
