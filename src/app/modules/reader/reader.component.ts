import { Component, OnInit } from '@angular/core';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

import { InkService } from "@core/services/ink.service";
import { ThemeService } from "@core/services/theme.service";

import { Segment } from "@core/classes/segment";
import { Choice } from "@core/classes/choice";

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
    this.choices = ink.choices;

    ink.Continue();
  }

  choiceSelected(): Choice {
    if (this.selectedChoice != undefined) {
      return this.selectedChoice;
    }
    else if (this.ink.continueChoice != undefined) {
      return this.ink.continueChoice;
    }
    else {
      return null;
    }
  }

  choiceIsDisabled(choice): boolean {
    var self = this;
    var value = false;
    choice.metadata.forEach(function(d) {
      switch (d.type) {
        case "requirement":
          var currentValue = +self.ink.story.variablesState[d.variableName];
          var soughtValue = +d.value;
          switch (d.operator) {
            case "==":
              value = !(currentValue == soughtValue); break;
            case "!=":
              value = !(currentValue != soughtValue); break;
            case ">":
              value = !(currentValue > soughtValue); break;
            case ">=":
              value = !(currentValue >= soughtValue); break;
            case "<":
              value = !(currentValue < soughtValue); break;
            case "<=":
              value = !(currentValue <= soughtValue); break;
            default:
              break;
          }
          if (value) {
            return value;
          }
        default:
          break;
      }
    });
    return value;
  }
  
  setTheme(_t): void {
    this.themeService.theme = _t; 
  }

  selectChoice(choice): void {
    this.selectedChoice = choice;
    this.confirmChoice();
  }

  confirmChoice(): void {
    var choiceIndex = this.choiceSelected().index;
    this.selectedChoice = undefined;
    this.ink.selectChoice(choiceIndex);
  }

  ngOnInit() {
  }

}
