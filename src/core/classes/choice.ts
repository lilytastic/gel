import { FUNCTION_TYPE, variable } from '@angular/compiler/src/output/output_ast';

import '@core/prototypes/string-prototypes';

export class Choice {
    index: number;
    text: string;
    metadata: any[];

    constructor(choice: any) {
        this.index = choice.index;
        const choiceElements: any = this.separateElements(choice.text);
        this.text = choiceElements.text;
        this.metadata = this.compileMetadata(choiceElements.meta);
    }

    separateElements(text: string): any {
        const bracketOpen = text.indexOf('(');
        const bracketClose = text.indexOf(')', bracketOpen);
        if (bracketOpen > -1) {
            return {
                text: text.splice(bracketOpen, bracketClose + 1).trim(),
                meta: text.substr(bracketOpen + 1, bracketClose - bracketOpen - 1).split(',')
            };
        } else {
            return {
                text: text,
                meta: []
            };
        }
    }

    compileMetadata(metadata: string[]): any[] {
        const elements: any[] = [];
        if (!metadata) {
            return elements;
        }

        const operators = ['>=', '<=', '>', '<', '!=', '==', '='];
        metadata.forEach(function(t) {
            t = t.trim();
            let operator = '';
            let operatorIndex = -1;
            for (let i = 0; i < operators.length; i++) {
                operatorIndex = t.indexOf(operators[i], 1);
                if (operatorIndex !== -1) {
                    operator = operators[i];
                    if (operator === '=') { operator = '=='; }
                    break;
                }
            }
            let variableName = '';
            let requiredValue = 0;
            if (operator) {
                variableName = t.substr(1, operatorIndex - 1).trim();
                requiredValue = +(t.substr(operatorIndex + operator.length).trim());
            }
            switch (t[0]) {
                case '&':
                    elements.push({
                        type: 'requirement',
                        variableName: variableName,
                        value: requiredValue,
                        operator: operator
                    });
                    break;
                case '$':
                    elements.push({
                        type: 'cost',
                        variableName: variableName,
                        value: requiredValue,
                        operator: operator
                    });
                    break;
                default:
                    break;
            }
        });
        return elements;
    }
}
