import { Component, EventEmitter, Input, ElementRef, Output, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { Choice } from '@core/classes/choice';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

@Component({
  selector: 'reader-choice',
  templateUrl: './reader-choice.component.html',
  styleUrls: ['./reader-choice.component.scss']
})
export class ReaderChoiceComponent implements OnInit {
  @Input() choice: Choice;
  @Input() selectedChoice: Choice;
  @Input() appendTo: string;
  @Output() selectChoice: EventEmitter<any> = new EventEmitter();

  isDisabled = false;
  ref: ElementRef;

  get isSelected(): boolean {
    return this.selectedChoice && this.selectedChoice === this.choice;
  }

  constructor(private _ref: ElementRef, private ink: InkService, private util: UtilityService) {
    this.ref = _ref;
  }

  ngOnInit(): void {
    this.isDisabled = this.choiceIsDisabled();
  }

  onClick(): void {
    if (this.choiceIsDisabled()) {
      return;
    }
    interval(10).subscribe(() => {
      this.selectChoice.emit(this.choice);
    });
  }

  getValue(variableName): any {
    return this.ink.story.variablesState[variableName];
  }

  choiceIsDisabled(): boolean {
    const self = this;
    let value = false;
    this.choice.metadata.forEach(function(d) {
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

}
