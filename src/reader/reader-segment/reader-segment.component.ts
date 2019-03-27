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

  displayLastChoice = false;
  visibleParagraphs: any[];
  lastChoice: Choice;
  hideFirstParagraph = false;

  constructor(private ref: ElementRef, private renderer: Renderer2) {
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
    this.renderer.addClass(nativeEl, 'active');
    this.renderer.addClass(nativeEl, 'ingrained');
  }

}
