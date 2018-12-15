import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as SegmentActions from '@reader/store/actions/segment.actions';

import { Segment } from '@app/classes/segment';
import { Choice } from '@app/classes/choice';
import { ReaderState } from '../store/reducers/segment.reducer';

@Injectable({
  providedIn: 'root'
})
export class InkService {
  story: any;
  segments: Segment[];
  choices: Choice[];

  continueChoice: Choice;

  constructor(private store: Store<ReaderState>) {

    this.choices = [];

    this.continueChoice = undefined;

    try {
      this.story = new inkjs.Story(storyContent);
    } catch (err) {
      console.error(err);
    }
  }

  Continue(lastChoice?: number): void {
    const paragraphs = [];
    while (this.story.canContinue) {
      const storyText: string = this.story.Continue();
      paragraphs.push({text: storyText.prettify()});
    }
    this.store.dispatch(new SegmentActions.AddSegment({
      id: Math.random() * 9999,
      paragraphs: paragraphs,
      lastChoice: this.choices && lastChoice ? this.choices[lastChoice] : undefined,
      choiceIndex: lastChoice
    }));
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
}
