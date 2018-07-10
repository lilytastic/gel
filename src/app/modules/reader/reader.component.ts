import { Component, OnInit } from '@angular/core';
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
          animate('0.35s ease-in-out', style({ opacity: 1 }))
        ], {optional: true})
      ])
    ]),
    trigger('segmentAnimation', [
      transition('* => *', [
        query(':leave', [
          stagger(300, [
            animate('0.8s', style({  opacity: 0 }))
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

  constructor(ink: InkService, private util: UtilityService) {
    this.ink = ink;

    this.choiceRequiresConfirmation = false;

    this.beginStory();
  }

  beginStory() {
    this.ink.Continue();
    this.segments = this.ink.segments;
    this.choices = this.ink.choices;
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

      const self = this;
      setTimeout(function() {
        self.selectedChoice = undefined;
        self.choices = self.ink.choices;
      }, 800);
    }
  }

  ngOnInit() {
  }

}
