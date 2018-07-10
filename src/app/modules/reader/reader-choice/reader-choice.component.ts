import { Component, EventEmitter, Input, ElementRef, Renderer2, AfterViewInit, Output } from '@angular/core';

import { Choice } from '@core/classes/choice';

import { InkService } from '@core/services/ink.service';
import { UtilityService } from '@core/services/util.service';

@Component({
  selector: 'reader-choice',
  templateUrl: './reader-choice.component.html',
  styleUrls: ['./reader-choice.component.scss']
})
export class ReaderChoiceComponent implements AfterViewInit {
  @Input() choice: Choice;
  @Input() selectedChoice: Choice;
  @Input() appendTo: string;
  @Output() selectChoice: EventEmitter<any> = new EventEmitter();

  bindEl: any;
  ref: ElementRef;
  renderer: Renderer2;

  get isSelected(): boolean {
    return this.selectedChoice && this.selectedChoice === this.choice;
  }

  constructor(private _ref: ElementRef, private _renderer: Renderer2, private ink: InkService, private util: UtilityService) {
    this.ref = _ref;
    this.renderer = _renderer;
  }

  ngAfterViewInit(): void {
    this.bindEl = this.getBindingElement();
    this.renderer.setStyle(this.ref.nativeElement, 'top', '0px');
  }

  getBindingElement(): any {
    let bindElm;
    if (this.appendTo) {
      bindElm = this.ref.nativeElement.querySelector(this.appendTo);
      if (!bindElm) {
        bindElm = document.querySelector(this.appendTo);
      }
      if (!bindElm) {
        bindElm = this.ref.nativeElement.closest(this.appendTo);
      }
    }
    return bindElm;
  }

  onClick(): void {
    if (this.choiceIsDisabled()) {
      return;
    }
    this.selectChoice.emit(this.choice);

    const appendToBounds = this.bindEl.getBoundingClientRect();
    const bounds = this.ref.nativeElement.getBoundingClientRect();
    const offset = (appendToBounds.top + appendToBounds.height) - bounds.top;
    this.renderer.setStyle(this.ref.nativeElement, 'top', offset + 'px');
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
