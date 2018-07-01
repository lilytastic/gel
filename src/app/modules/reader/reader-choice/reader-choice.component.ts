import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Output() selectChoice: EventEmitter<any> = new EventEmitter();

  constructor(private ink: InkService, private util: UtilityService) { }

  ngOnInit() {
  }

  onClick(): void {
    this.selectChoice.emit(this.choice.index);
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
