import { Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

import { Segment } from '@core/classes/segment';
import { Choice } from '@core/classes/choice';
import { utils } from 'protractor';

@Component({
  selector: 'app-reader',
  animations: [
    trigger('segmentAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(300, [
            animate('0.8s', style({ opacity: 0 }))
          ])
        ], {optional: true}),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(300, [
            animate('0.8s', style({ opacity: 1 }))
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

  constructor(ink: InkService, private util: UtilityService) {
    this.ink = ink;

    this.segments = ink.segments;
    this.choices = ink.choices;

    this.beginStory();
  }

  beginStory() {
    this.ink.Continue();
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
  }

  confirmChoice(): void {
    const choiceIndex = this.choiceSelected().index;
    this.selectedChoice = undefined;
    this.ink.selectChoice(choiceIndex);
  }

  ngOnInit() {
  }

}
