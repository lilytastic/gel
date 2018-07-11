import { Component, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';

import { Segment } from '@core/classes/segment';

@Component({
  selector: 'reader-segment',
  templateUrl: './reader-segment.component.html',
  styleUrls: ['./reader-segment.component.scss']
})
export class ReaderSegmentComponent implements AfterViewInit {
  @Input() segment: Segment;

  ref: ElementRef;
  renderer: Renderer2;

  constructor(private _ref: ElementRef, private _renderer: Renderer2) {
    this.ref = _ref;
    this.renderer = _renderer;
  }

  ngAfterViewInit() {
    // Start this off at the position of the choice, if it exists.
    let bindElm = null;
    let segmentContainerElm = null;
    const nativeEl = this.ref.nativeElement;

    if (this.segment.choiceIndex !== undefined) {
      bindElm = document.querySelector('#choice' + this.segment.choiceIndex);
      segmentContainerElm = document.querySelector('#sections');
    }
    if (bindElm && segmentContainerElm) {
      const otherBounds = bindElm.getBoundingClientRect();
      const bounds = nativeEl.getBoundingClientRect();
      const segmentContainerBounds = segmentContainerElm.getBoundingClientRect();

      this.renderer.addClass(nativeEl, 'addition');
      this.renderer.setStyle(nativeEl, 'position', 'absolute');

      const mobile = false; // window.screen.width < 575;
      this.renderer.setStyle(nativeEl, 'top', (mobile ? otherBounds.top : bindElm.offsetTop) + 'px');

      this.renderer.setStyle(nativeEl, 'max-height', otherBounds.height + 'px');
      this.renderer.setStyle(nativeEl, 'width', segmentContainerBounds.width + 'px');
      this.renderer.setStyle(nativeEl, 'transition', 'opacity .15s ease-in-out, top 0.8s ease-in-out, box-shadow .35s ease-in-out, max-height .35s ease-in-out');
      const self = this;
      setTimeout(function() {
        self.renderer.addClass(nativeEl, 'moving');
        self.renderer.addClass(nativeEl, 'active');
        self.renderer.setStyle(nativeEl, 'top', segmentContainerElm.offsetTop + segmentContainerElm.offsetHeight + 'px');
        self.renderer.setStyle(nativeEl, 'max-height', nativeEl.scrollHeight + 'px');
        setTimeout(function() {
          self.renderer.removeClass(nativeEl, 'moving');
          self.renderer.addClass(nativeEl, 'ingrained');
          self.renderer.setStyle(nativeEl, 'transition', 'box-shadow .35s ease-in-out, border-radius .35s ease-in-out, border-top .35s ease-in-out .2s');
          self.renderer.setStyle(nativeEl, 'max-height', 'unset');
          self.renderer.setStyle(nativeEl, 'width', 'auto');
          self.renderer.setStyle(nativeEl, 'position', 'relative');
          self.renderer.setStyle(nativeEl, 'top', '0px');
        }, 1100);
      }, 50);
    } else {
      this.renderer.addClass(nativeEl, 'active');
      this.renderer.addClass(nativeEl, 'ingrained');
    }
  }

}
