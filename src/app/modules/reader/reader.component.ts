import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

import { FlexHeightDirective } from '@shared/directives/flex-height.directive';

import { Segment } from '@core/classes/segment';
import { Choice } from '@core/classes/choice';
import { utils } from 'protractor';

@Component({
  selector: 'app-reader',
  animations: [
    trigger('choiceAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(300, [
            style({ opacity: 0, transform: 'scale(0.9)' }),
            animate('0.35s ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
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
export class ReaderComponent implements OnInit {
  segments: Segment[];
  choices: any[];
  selectedChoice: any;
  ink: InkService;
  choiceRequiresConfirmation: boolean;

  segmentLength = -1;
  choiceLength = -1;

  ngOnInit() {
    const self = this;
  }

  constructor(ink: InkService, private util: UtilityService) {
    this.ink = ink;

    this.choiceRequiresConfirmation = false;

    const self = this;
    setTimeout(self.beginStory.bind(self), 100);
  }

  beginStory() {
    console.log(this.ink.story.currentTags);
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
    this.selectedChoice = choice;
    if (!this.choiceRequiresConfirmation) {
      const self = this;
      self.confirmChoice();
    }
  }

  scrollTo(bottom): void {
    let scrollTarget = bottom;
    const body = document.body;
    const html = document.documentElement;
    const maxHeight = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    let cap = maxHeight - screen.height;
    if (cap < 0) {
      cap = 0;
    }
    //console.log(maxHeight, window.innerHeight, cap);

    if (scrollTarget > cap) {
      //scrollTarget = cap;
    }

    const start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // console.log(`Start: ${start}, target: ${scrollTarget}`);
    const dist = scrollTarget - start;
    const speed = 300;
    const duration = speed + speed * dist / 100;
    if (dist < 0) {
      return;
    }

    let startTime = null;
    function step(time) {
      if (startTime == null) {
        startTime = time;
      }
      const t = (time - startTime) / duration;
      const lerp = 3*t*t - 2*t*t*t;
      if (document.body.scrollTo) {
        document.body.scrollTo(0, start + lerp * dist);
      } else {
        document.body.scrollTop = start + lerp * dist;
      }
      if (t < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  confirmChoice(): void {
    const selectedChoice = this.selectedChoice;
    if (selectedChoice && selectedChoice.index !== undefined) {

      // Scroll to the latest segment
      const latestSegment = <HTMLElement>document.querySelector('#latest');
      const bounds = latestSegment.getBoundingClientRect();
      const self = this;

      setTimeout(function() {
        const target = screen.width < 575 ?
            (latestSegment.offsetTop + latestSegment.scrollHeight - 10) :
            (latestSegment.offsetTop + latestSegment.scrollHeight - 200);
        self.scrollTo(target);
      }, 100);

      const choiceIndex = selectedChoice.index;
      this.ink.selectChoice(choiceIndex);
      this.segments = this.ink.segments;
      this.choiceLength = this.ink.choices.length;

      setTimeout(function() {
        // By now, our choice animations should be over; previous choices are visually gone.
        self.selectedChoice = undefined;
        self.choices = self.ink.choices;
        // This acts as the trigger for choice animations. We wait until we have the choices before changing it.
        self.segmentLength = self.segments.length;
      }, 900);
    }
  }

}
