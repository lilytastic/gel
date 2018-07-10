import { Component, EventEmitter, Input, ElementRef, Renderer2, AfterViewInit, Output } from '@angular/core';

import { Choice } from '@core/classes/choice';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

@Component({
  selector: 'reader-choice',
  templateUrl: './reader-choice.component.html',
  styleUrls: ['./reader-choice.component.scss']
})
export class ReaderChoiceComponent {
  @Input() choice: Choice;
  @Input() selectedChoice: Choice;
  @Input() appendTo: string;
  @Output() selectChoice: EventEmitter<any> = new EventEmitter();

  get isSelected(): boolean {
    return this.selectedChoice && this.selectedChoice === this.choice;
  }

  constructor(private ink: InkService, private util: UtilityService) {
  }

  onClick(): void {
    if (this.choiceIsDisabled()) {
      return;
    }
    this.selectChoice.emit(this.choice);
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
