import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { Observable, timer } from 'rxjs';
import { Store } from '@ngrx/store';

import { InkService } from '@reader/services/ink.service';
import { UtilityService } from '@reader/services/util.service';

import { Segment } from '@app/models/segment.model';
import { Choice } from '@app/classes/choice';

import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';
import { ReaderState } from './store/reducers/segment.reducer';
import { getSegmentsState } from './store/selectors/segment.selector';
import { ScrollService } from '@app/services/scroll.service';

@Component({
  selector: 'app-reader',
  animations: [
    trigger('choiceAnimation', [
      transition('* => *', [
        query('button', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('1.5s ease-in-out', style({ opacity: 1 }))
          ])
        ], {optional: true})
      ])
    ])
  ],
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit, AfterViewInit {
  @ViewChild('sections') sections: ElementRef;
  @ViewChild('sideNav') sideNav: ElementRef;
  @ViewChildren(ReaderChoiceComponent) choiceElements: QueryList<ReaderChoiceComponent>;

  get readingLine() {
    return screen.width < 575 ? 20 : Math.min(300, window.innerHeight * 0.25);
  }

  scrollEnd = 0;

  segments: Segment[];
  choices: any[];
  selectedChoice: any;
  choiceRequiresConfirmation: boolean;

  handlingChoice = false;

  segmentLength = -1;
  choiceLength = -1;

  minHeight = 0;

  lastChoice: ElementRef;
  scrolledPast = true;

  constructor(private store:     Store<ReaderState>,
              private ink:       InkService,
              private util:      UtilityService,
              private ref:       ElementRef,
              private renderer:  Renderer2,
              private scrollService: ScrollService) {
  }

  ngOnInit(): void {
    this.store.select(getSegmentsState).subscribe(data => {
      this.segments = data;
      if (data.length > 0) {
        this.handleAnimation(data);
      }
    });

    this.choiceRequiresConfirmation = false;

    const self = this;
    window.requestAnimationFrame(() => { this.beginStory(); });
  }

  ngAfterViewInit() {
    this.choiceElements.changes.subscribe((r) => {
      if (r.last) {
        this.lastChoice = r.last.ref;
        window.requestAnimationFrame(() => {
          this.scrollEnd = this.lastChoice.nativeElement.getBoundingClientRect().bottom;
        });
      }
    });
    this.setMinHeight();
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
    this.setMinHeight();
    this.scrollEnd = this.lastChoice.nativeElement.getBoundingClientRect().bottom;
    if (this.sideNav) {
      const self = this;
      this.renderer.setStyle(this.sideNav.nativeElement, 'transform', `translateY(${event.target.documentElement.scrollTop}px)`);
      this.renderer.setStyle(this.sideNav.nativeElement, 'opacity', '0.15');
      setTimeout(function() {
        self.renderer.setStyle(self.sideNav.nativeElement, 'opacity', '1');
      }, 1700);
    }
  }

  @HostListener('window:keypress', ['$event']) onKeyDown(event) {
    const key = parseInt(event.key, 10);
    if (key && key <= this.choices.length) {
      this.selectChoice(this.choices[key - 1]);
    }
  }

  beginStory() {
    this.ink.Continue();
  }

  updateChoices() {
    this.choices = this.ink.compileChoices(this.ink.story.currentChoices);
    this.choiceLength = this.choices.length;
  }

  getValue(variableName): any {
    return this.ink.story.variablesState[variableName];
  }

  choiceSelected(): Choice {
    if (this.selectedChoice !== undefined) {
      return this.selectedChoice;
    } else if (this.ink.continueChoice !== undefined) {
      return this.ink.continueChoice;
    } else {
      return null;
    }
  }

  selectChoice(choice): void {
    if (this.handlingChoice) {
      return;
    }
    this.selectedChoice = choice;
    if (!this.choiceRequiresConfirmation) {
      const self = this;
      self.confirmChoice();
    }
  }

  confirmChoice(): void {
    if (this.selectedChoice && this.selectedChoice.index !== undefined) {
      const choiceIndex = this.selectedChoice.index;
      this.ink.story.ChooseChoiceIndex(choiceIndex);
      this.ink.Continue(choiceIndex);
    }
  }

  setMinHeight(): void {
    const latestSegment = <HTMLElement>document.querySelector('#latest');
    const segmentBottom = latestSegment.getBoundingClientRect().top + window.scrollY;
    this.minHeight = (segmentBottom) + window.innerHeight - this.readingLine;
  }

  handleAnimation(segmentState): void {
    // Scroll to the latest segment
    const latestSegment = <HTMLElement>document.querySelector('#latest');

    this.renderer.addClass(this.ref.nativeElement, 'animating');
    this.choices = [];

    if (latestSegment) {
      window.requestAnimationFrame(() => {
        this.setMinHeight();
        const segmentBottom = latestSegment.getBoundingClientRect().bottom + window.scrollY;
        const target = segmentBottom - this.readingLine;
        this.scrollService.scrollTo(target);
      });
    }

    timer(900).subscribe(() => {
      // By now, our choice animations should be over; previous choices are visually gone.
      this.handlingChoice = false;
      this.selectedChoice = undefined;
      // This acts as the trigger for choice animations. We wait until we have the choices before changing it.
      this.updateChoices();
      this.segmentLength = segmentState.length;
      this.renderer.removeClass(this.ref.nativeElement, 'animating');
    });
  }

}
