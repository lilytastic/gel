import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InkService {

  story: any;

  Continue(): void {
    return this.story.Continue();
  }

  constructor() { 
    this.story = new inkjs.Story(storyContent);
  }
}
