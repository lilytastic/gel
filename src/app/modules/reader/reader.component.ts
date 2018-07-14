import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

import { FlexHeightDirective } from '@shared/directives/flex-height.directive';

import { Segment } from '@core/classes/segment';
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
    ]),
    trigger('segmentAnimation', [
      transition('* => *', [
        query(':leave', [
          stagger(300, [
            animate('0.8s ease-in-out', style({ opacity: 0 }))
          ])
        ], {optional: true}),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(300, [
            animate('0.8s ease-in-out', style({ opacity: 1 }))
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

  segments: Segment[];
  choices: any[];
  selectedChoice: any;
  ink: InkService;
  choiceRequiresConfirmation: boolean;
  ref: ElementRef;
  renderer: Renderer2;

  handlingChoice = false;

  segmentLength = -1;
  choiceLength = -1;

  isScrolling = false;
  lastChoice: ElementRef;
  scrolledPast = true;

  ngOnInit() {
    const self = this;
  }

  ngAfterViewInit() {
    this.choiceElements.changes.subscribe((r) => {
      this.lastChoice = r.last.ref;
      this.checkIfScrolledPastChoices();
    });
  }

  clickScrollIndicator(): void {
    this.scrollTo(window.scrollY + this.lastChoice.nativeElement.getBoundingClientRect().bottom - window.innerHeight + 20, 100);
  }

  constructor(ink: InkService, private util: UtilityService, private _ref: ElementRef, private _renderer: Renderer2) {
    this.ref = _ref;
    this.renderer = _renderer;
    this.ink = ink;

    this.choiceRequiresConfirmation = false;

    const self = this;
    window.requestAnimationFrame(() => { this.beginStory(); });
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
    this.segments = this.ink.segments;
    this.choices = this.ink.choices;
    this.segmentLength = this.segments.length;
    this.choiceLength = this.ink.choices.length;
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
          value = !(self.util.checkWithOperator[d.operator](currentValue, soughtValue));
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
    const selectedChoice = this.selectedChoice;
    if (selectedChoice && selectedChoice.index !== undefined) {
      this.handlingChoice = true;

      // Scroll to the latest segment
      const latestSegment = <HTMLElement>document.querySelector('#latest');
      const bounds = latestSegment.getBoundingClientRect();
      const self = this;

      this.renderer.addClass(this.ref.nativeElement, 'animating');

      const choiceIndex = selectedChoice.index;
      this.ink.selectChoice(choiceIndex);
      this.segments = this.ink.segments;
      this.choiceLength = this.ink.choices.length;

      window.requestAnimationFrame(() => {
        const segmentBottom = latestSegment.getBoundingClientRect().bottom + window.scrollY;
        const target = screen.width < 575 ?
            (segmentBottom - 20) :
            (segmentBottom - Math.min(300, window.innerHeight * 0.25));
        this.scrollTo(target);
      });

      setTimeout(function() {
        // By now, our choice animations should be over; previous choices are visually gone.
        self.handlingChoice = false;
        self.selectedChoice = undefined;
        self.choices = self.ink.choices;
        // This acts as the trigger for choice animations. We wait until we have the choices before changing it.
        self.segmentLength = self.segments.length;
        self.renderer.removeClass(self.ref.nativeElement, 'animating');
      }, 900);
    }
  }

}
