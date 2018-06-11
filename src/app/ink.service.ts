import { Injectable } from '@angular/core';
import { Segment } from "./classes/segment";

@Injectable({
  providedIn: 'root'
})
export class InkService {

  story: any;
  segments: Segment[];
  currentChoices: any[];

  Continue(): void {
    while (this.story.canContinue) {
      let _segment: Segment = {
        text: this.story.Continue()
      }
      this.segments.push(_segment);
    }
    this.currentChoices = this.story.currentChoices;
  }

  selectChoice(choice): void {
    this.story.ChooseChoiceIndex(choice.index);
    this.Continue();
  }

  constructor() { 
    this.segments = [];
    if ("storyContent" in window) {
      this.story = new inkjs.Story(storyContent);
    }
    else {
      console.log("No story!");
    }
  }
}
