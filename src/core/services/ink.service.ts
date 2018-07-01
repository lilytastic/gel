import { Injectable } from '@angular/core';

import { Segment } from '@core/classes/segment';
import { Choice } from '@core/classes/choice';

@Injectable({
  providedIn: 'root'
})
export class InkService {

  story: any;
  segments: Segment[];
  choices: Choice[];

  continueChoice: Choice;

  Continue(): void {
    while (this.story.canContinue) {
      const _segment: Segment = {
        text: this.story.Continue()
      };
      this.segments.push(_segment);
    }
    this.resetNode();
    this.choices = this.compileChoices(this.story.currentChoices);
  }

  resetNode(): void {
    this.continueChoice = undefined;
  }

  compileChoices(raw): Choice[] {
    const _choices = [];
    const self = this;
    raw.forEach(function(c) {
      switch (c.text) {
        case 'DO NOTHING':
          self.continueChoice = c;
          break;
        default:
          _choices.push(new Choice(c));
          break;
      }
    });
    return _choices;
  }

  selectChoice(choice): void {
    this.story.ChooseChoiceIndex(choice);
    this.Continue();
  }

  constructor() {
    this.segments = [];
    this.choices = [];

    this.continueChoice = undefined;

    try {
      this.story = new inkjs.Story(storyContent);
    } catch (err) {
      console.error(err);
    }
  }
}
