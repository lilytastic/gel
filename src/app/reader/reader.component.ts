import { Component, OnInit } from '@angular/core';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

import { InkService } from "../ink.service";
import { ThemeService } from "../theme.service";

import { Segment } from "../classes/segment";

@Component({
  selector: 'app-reader',
  animations: [
    trigger('listAnimation', [
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

  constructor(ink: InkService, private themeService: ThemeService) { 
    this.ink = ink;

    this.segments = ink.segments;
    this.choices = ink.currentChoices;

    ink.Continue();
  }
  
  setTheme(_t): void {
    this.themeService.theme = _t; 
  }

  selectChoice(choice): void {
    this.selectedChoice = choice;
  }

  confirmChoice(): void {
    this.ink.selectChoice(this.selectedChoice);
    this.selectedChoice = undefined;
  }

  ngOnInit() {
  }

}
