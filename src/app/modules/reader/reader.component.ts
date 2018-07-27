import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { Observable, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@modules/app/app.state';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

import { FlexHeightDirective } from '@shared/directives/flex-height.directive';

import { Segment } from '@core/models/segment.model';

import { Choice } from '@core/classes/choice';

import { utils } from 'protractor';

import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';

@Component({
  selector: 'app-reader',
  animations: [
    trigger('choiceAnimation', [
      transition('* => *', [
        query('.choices', [
          style({ opacity: 0 }),
          animate('1.5s ease-in-out', style({ opacity: 1 }))
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

  segments: Observable<Segment[]>;
  choices: any[];
  selectedChoice: any;
  ink: InkService;
  util: UtilityService;
  choiceRequiresConfirmation: boolean;
  ref: ElementRef;
  renderer: Renderer2;

  handlingChoice = false;

  segmentLength = -1;
  choiceLength = -1;

  isScrolling = false;
  lastChoice: ElementRef;
  scrolledPast = true;

  store: Store<AppState>;

  constructor(private _store:      Store<AppState>,
              _ink:                InkService,
              _util:               UtilityService,
              private _ref:       ElementRef,
              private _renderer:  Renderer2) {
    this.ref = _ref;
    this.renderer = _renderer;
    this.util = _util;
    this.ink = _ink;
    this.store = _store;
  }

  ngOnInit(): void {
    this.segments = this.store.select('segments');
    this.segments.subscribe(state => {
      this.handleAnimation(state);
    });

    this.choiceRequiresConfirmation = false;

    const self = this;
    window.requestAnimationFrame(() => { this.beginStory(); });
  }

  ngAfterViewInit() {
    this.choiceElements.changes.subscribe((r) => {
      if (r.last) {
        this.lastChoice = r.last.ref;
        window.requestAnimationFrame(() => { this.checkIfScrolledPastChoices(); });
      }
    });
  }

  clickScrollIndicator(): void {
    this.scrollTo(window.scrollY + this.lastChoice.nativeElement.getBoundingClientRect().bottom - window.innerHeight + 20, 100);
  }

  checkIfScrolledPastChoices(): void {
    this.scrolledPast = true;
    if (this.lastChoice) {
      this.scrolledPast = window.innerHeight > this.lastChoice.nativeElement.getBoundingClientRect().bottom + 4;
    }
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
    this.checkIfScrolledPastChoices();
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

  choiceIsDisabled(choice): boolean {
    const self = this;
    let value = false;
    choice.metadata.forEach(function(d) {
      switch (d.type) {
        case 'requirement':
          const currentValue = +self.ink.story.variablesState[d.variableName];
          const soughtValue = +d.value;
          value = !(this.util.checkWithOperator[d.operator](currentValue, soughtValue));
          break;
        default:
          break;
      }
    });
    return value;
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

  scrollTo(bottom, speed = 300): void {
    if (this.isScrolling) {
      return;
    }
    this.isScrolling = true;
    const scrollTarget = bottom;
    const body = document.body;
    const html = document.documentElement;
    const maxHeight = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

    const start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const dist = scrollTarget - start;
    const duration = speed + speed * dist / 100;
    if (dist < 0) {
      this.isScrolling = false;
      return;
    }

    const self = this;
    let startTime = null;
    function step(time) {
      if (startTime == null) {
        startTime = time;
      }
      const t = (time - startTime) / duration;
      const lerp = 3*t*t - 2*t*t*t;
      if (window.scroll) {
        window.scroll(0, start + lerp * dist);
      } else if (document.body.scrollTo) {
        document.body.scrollTo(0, start + lerp * dist);
      } else {
        document.body.scrollTop = start + lerp * dist;
      }
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        self.isScrolling = false;
      }
    }
    requestAnimationFrame(step);
  }

  confirmChoice(): void {
    if (this.selectedChoice && this.selectedChoice.index !== undefined) {
      const choiceIndex = this.selectedChoice.index;
      this.ink.story.ChooseChoiceIndex(choiceIndex);
      this.ink.Continue(choiceIndex);
    }
  }

  handleAnimation(segmentState): void {
    // Scroll to the latest segment
    const latestSegment = <HTMLElement>document.querySelector('#latest');

    this.renderer.addClass(this.ref.nativeElement, 'animating');

    if (latestSegment) {
      window.requestAnimationFrame(() => {
        const segmentBottom = latestSegment.getBoundingClientRect().bottom + window.scrollY;
        const target = screen.width < 575 ?
            (segmentBottom - 20) :
            (segmentBottom - Math.min(300, window.innerHeight * 0.25));
        this.scrollTo(target);
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
