import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';
import { timer } from 'rxjs';

import { Segment } from '@app/models/segment.model';

import { Choice } from '@app/classes/choice';

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
      const otherBounds = bindElm.getBoundingClientRect();
      const bounds = nativeEl.getBoundingClientRect();
      this.renderer.addClass(nativeEl, 'addition');
      this.renderer.setStyle(nativeEl, 'position', 'absolute');
      this.renderer.setStyle(nativeEl, 'transform', `translateY(${bindElm.offsetTop - nativeEl.offsetTop}px)`);
      this.renderer.setStyle(nativeEl, 'width', `${bounds.width}px`);
      this.renderer.setStyle(nativeEl, 'max-height', `${otherBounds.height}px`);

      window.requestAnimationFrame(() => {
        const transitionSpeed = 650;
        this.renderer.addClass(nativeEl, 'moving');
        this.renderer.addClass(nativeEl, 'active');
        this.renderer.setStyle(nativeEl, 'transition', `
          opacity .15s ease-in-out,
          transform ${transitionSpeed * 0.001}s ease-in-out,
          box-shadow .35s ease-in-out,
          max-height .35s ease-in-out
        `);
        this.renderer.setStyle(nativeEl, 'transform', `translateY(0px)`);
        this.renderer.setStyle(nativeEl, 'max-height', nativeEl.scrollHeight + 'px');

        timer(transitionSpeed).subscribe(() => {
          this.renderer.addClass(nativeEl, 'ingrained');
          this.renderer.removeClass(nativeEl, 'moving');
          this.renderer.removeAttribute(nativeEl, 'style');
        });
      });
    } else {
      this.renderer.addClass(nativeEl, 'active');
      this.renderer.addClass(nativeEl, 'ingrained');
    }
  }

}
