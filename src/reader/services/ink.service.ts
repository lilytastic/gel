import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as SegmentActions from '@reader/store/actions/segment.actions';

import { Segment, Paragraph, ParagraphType } from '@app/classes/segment';
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
      this.story.variablesState['environment'] = 'gel';
    } catch (err) {
      console.error(err);
    }
  }

  lastSpeaker = '';

  makeParagraph(storyText: string): Paragraph {
    storyText = storyText.trim();
    const tokens = storyText.split(' ');
    let text: string = storyText.prettify();
    let type = ParagraphType.Paragraph;
    let options = {};
    if (storyText.toLowerCase().endsWith('to:')) {
      type = ParagraphType.Transition;
      this.lastSpeaker = '';
    } else if (storyText.startsWith('pause')) {
      type = ParagraphType.Paragraph;
      text = '(beat)';
    } else if (storyText.toLowerCase().startsWith('int.') || storyText.toLowerCase().startsWith('ext.')) {
      type = ParagraphType.SceneHeading;
      this.lastSpeaker = '';
    } else if (storyText.indexOf('\"') !== -1 && storyText.indexOf('\"') !== storyText.lastIndexOf('\"') ) {
      type = ParagraphType.Dialogue;
      text = storyText.slice(storyText.indexOf('\"') + 1, storyText.lastIndexOf('\"')).prettify();
      const speaker = this.story.variablesState[tokens[0]] || '???';
      options = {
        speaker: speaker,
        continued: this.lastSpeaker === speaker
      };
      this.lastSpeaker = speaker;
    } else if (tokens.length) {
      switch (tokens[0].trim()) {
        case 'DIRECTION:':
          type = ParagraphType.Paragraph;
          text = storyText.slice(10).prettify();
          break;
        default:
          break;
      }
    }
    return {text: text, type: type, options: options};
  }

  Continue(lastChoice?: number): void {
    const paragraphs: Paragraph[] = [];
    while (this.story.canContinue) {
      const text = this.story.Continue();
      paragraphs.push(this.makeParagraph(text));
    }
    this.store.dispatch(new SegmentActions.AddSegment({
      id: Math.random() * 9999,
      paragraphs: paragraphs,
      lastChoice: this.choices && lastChoice ? this.choices[lastChoice] : undefined,
      choiceIndex: lastChoice
    }));
  }

  addText(text: string) {
    this.store.dispatch(new SegmentActions.AddSegment({
      id: Math.random() * 9999,
      paragraphs: [this.makeParagraph(text)],
      lastChoice: undefined,
      choiceIndex: undefined
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
