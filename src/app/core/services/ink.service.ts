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

  Continue(lastChoice?: number): Segment {
    const paragraphs = [];
    while (this.story.canContinue) {
      paragraphs.push({text: this.story.Continue()});
    }
    const _segment = new Segment(paragraphs, lastChoice);
    this.segments.push(_segment);
    this.resetNode();
    this.choices = this.compileChoices(this.story.currentChoices);
    return _segment;
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
    this.Continue(choice);
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
