import { Directive, ElementRef, Renderer2, AfterViewInit, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[flexHeight]'
})
export class FlexHeightDirective implements AfterViewInit {
  desiredHeight = 0;
  ref: ElementRef;
  renderer: Renderer2;
  observer: MutationObserver;

  constructor(private _ref: ElementRef, private _renderer: Renderer2) {
    this.ref = _ref;
    this.renderer = _renderer;
  }
  ngAfterViewInit(): void {
    const self = this;
    this.observer = new MutationObserver(mutations => {
      self.adjustHeight();
      console.log(mutations);
    });
    this.adjustHeight();
    this.observer.observe(this.ref.nativeElement, {attributes: true});
  }

  @HostListener('window:resize') onWindowResize(): void {
    this.adjustHeight();
  }

  adjustHeight(): void {
    this.desiredHeight = this.ref.nativeElement.scrollHeight;
    this.renderer.setStyle(this.ref.nativeElement, 'max-height', this.desiredHeight + 'px');
  }

}
