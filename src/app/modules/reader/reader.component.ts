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

    this.beginStory();
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
    this.selectedChoice = choice;
    if (!this.choiceRequiresConfirmation) {
      const self = this;
      self.confirmChoice();
    }
  }

  confirmChoice(): void {
    const selectedChoice = this.selectedChoice;
    if (selectedChoice && selectedChoice.index !== undefined) {
      const choiceIndex = selectedChoice.index;
      this.ink.selectChoice(choiceIndex);
      this.segments = this.ink.segments;
      this.choiceLength = this.ink.choices.length;

      const self = this;
      setTimeout(function() {
        // By now, our choice animations should be over; previous choices are visually gone.
        self.selectedChoice = undefined;
        self.choices = self.ink.choices;
        // This acts as the trigger for choice animations. We wait until we have the choices before changing it.
        self.segmentLength = self.segments.length;
        setTimeout(function() {
          const latestSegment = document.querySelector('#latest');
          latestSegment.scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 100);
      }, 1200);
    }
  }

}
