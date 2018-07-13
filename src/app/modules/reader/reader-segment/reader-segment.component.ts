import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';

import { Segment } from '@core/classes/segment';
import { Choice } from '@core/classes/choice';

@Component({
  selector: 'reader-segment',
  templateUrl: './reader-segment.component.html',
  styleUrls: ['./reader-segment.component.scss']
})
export class ReaderSegmentComponent implements OnInit, AfterViewInit {
  @Input() segment: Segment;

  ref: ElementRef;
  renderer: Renderer2;
  displayLastChoice = false;
  visibleParagraphs: any[];
  lastChoice: Choice;
  hideFirstParagraph = false;

  constructor(private _ref: ElementRef, private _renderer: Renderer2) {
    this.ref = _ref;
    this.renderer = _renderer;
  }

  ngOnInit() {
  }

  getChoiceSection(): HTMLElement {
    if (this.segment.choiceIndex !== undefined) {
      return document.querySelector('#choice' + this.segment.choiceIndex);
    } else {
      return undefined;
    }
  }

  ngAfterViewInit() {
    // Start this off at the position of the choice, if it exists.
    const bindElm: HTMLElement = this.getChoiceSection();
    const nativeEl = this.ref.nativeElement;

    if (bindElm) {
      const self = this;
      const otherBounds = bindElm.getBoundingClientRect();
      const bounds = nativeEl.getBoundingClientRect();
      this.renderer.addClass(nativeEl, 'addition');
      this.renderer.setStyle(nativeEl, 'position', 'absolute');
      this.renderer.setStyle(nativeEl, 'transform', `translateY(${bindElm.offsetTop - nativeEl.offsetTop}px)`);
      this.renderer.setStyle(nativeEl, 'width', `${bounds.width}px`);
      self.renderer.setStyle(nativeEl, 'max-height', `${otherBounds.height}px`);

      setTimeout(function() {
        const mobile = false; // window.screen.width < 575;
        // this.renderer.setStyle(nativeEl, 'top', `${(mobile ? otherBounds.top : bindElm.offsetTop)}px`);

        const transitionSpeed = 650;
        self.renderer.addClass(nativeEl, 'moving');
        self.renderer.addClass(nativeEl, 'active');
        self.renderer.setStyle(nativeEl, 'transition', `
          opacity .15s ease-in-out,
          transform ${transitionSpeed * 0.001}s ease-in-out,
          box-shadow .35s ease-in-out,
          max-height .35s ease-in-out
        `);
        self.renderer.setStyle(nativeEl, 'transform', `translateY(0px)`);
        self.renderer.setStyle(nativeEl, 'max-height', nativeEl.scrollHeight + 'px');

        setTimeout(function() {
          self.renderer.addClass(nativeEl, 'ingrained');
          self.renderer.removeClass(nativeEl, 'moving');
          self.renderer.removeAttribute(nativeEl, 'style');
        }, transitionSpeed + 10);
      }, 50);
    } else {
      this.renderer.addClass(nativeEl, 'active');
      this.renderer.addClass(nativeEl, 'ingrained');
    }
  }

}
