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
    if (this.segment.lastChoice) {
      this.lastChoice = this.segment.lastChoice;
      this.displayLastChoice = true;
      this.visibleParagraphs = this.segment.paragraphs;
      if (this.visibleParagraphs.length > 0) {
        const text = this.visibleParagraphs[0].text;
        if (text.startsWith(this.lastChoice.text)) {
          let highlightLength = this.lastChoice.text.length;
          if (text[highlightLength] === '.') {
            highlightLength++;
          }
          this.visibleParagraphs[0].text = `
            <span class="highlighted">
              >
              ${text.substr(0, highlightLength)}
            </span>
            ${text.substr(highlightLength)}
          `;
          this.displayLastChoice = false;
        }
      }
    }
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
      const self = this;
      const otherBounds = bindElm.getBoundingClientRect();
      const bounds = nativeEl.getBoundingClientRect();
      const segmentContainerBounds = segmentContainerElm.getBoundingClientRect();

      this.renderer.addClass(nativeEl, 'addition');
      this.renderer.setStyle(nativeEl, 'position', 'absolute');
      this.renderer.setStyle(nativeEl, 'transform', `translateY(${bindElm.offsetTop}px)`);
      this.renderer.setStyle(nativeEl, 'top', '0px');
      this.renderer.setStyle(nativeEl, 'width', `${segmentContainerBounds.width - 2}px`);
      self.renderer.setStyle(nativeEl, 'max-height', `${otherBounds.height}px`);

      setTimeout(function() {
        const mobile = false; // window.screen.width < 575;
        // this.renderer.setStyle(nativeEl, 'top', `${(mobile ? otherBounds.top : bindElm.offsetTop)}px`);

        const transitionSpeed = 650;
        self.renderer.addClass(nativeEl, 'moving');
        self.renderer.addClass(nativeEl, 'active');
        self.renderer.setStyle(nativeEl, 'transition', `opacity .15s ease-in-out, transform ${transitionSpeed*0.001}s ease-in-out, box-shadow .35s ease-in-out, max-height .35s ease-in-out`);
        // this.renderer.setStyle(nativeEl, 'top', `${segmentContainerElm.offsetTop + segmentContainerElm.offsetHeight}px`);
        self.renderer.setStyle(nativeEl, 'transform', `translateY(${segmentContainerElm.offsetTop + segmentContainerElm.offsetHeight}px)`);
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
