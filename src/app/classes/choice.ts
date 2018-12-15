import '@app/prototypes/string-prototypes';

export class Choice {
    index: number;
    text: string;
    rawText: string;
    metadata: any[];

    constructor(choice: any) {
        this.index = choice.index;
        this.rawText = choice.text;
        const choiceElements: any = this.separateElements(choice.text);
        this.text = choiceElements.text.prettify();
        this.metadata = this.compileMetadata(choiceElements.meta);
    }

    separateElements(text: string): any {
        let bracketOpen = text.indexOf('(');
        if (text[bracketOpen - 1] === '\\') {
            text = text.replace('\\(', '(');
            bracketOpen = text.indexOf('(', bracketOpen + 1);
        }

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

        const operators = ['>=', '<=', '>', '<', '!=', '!==', '==', '='];
        const types = {
            '&': 'requirement',
            '$': 'cost'
        };
        metadata.forEach(function(t) {
            t = t.trimWhiteSpaces();
            let operatorIndex = -1;
            const operator = operators.find((x) => {
                operatorIndex = t.indexOf(x, 1);
                return operatorIndex !== -1;
            });
            if (operator) {
                const variableName = t.substr(1, operatorIndex - 1).trim();
                const requiredValue = +(t.substr(operatorIndex + operator.length).trim());
                Object.keys(types).forEach(function(type) {
                    if (t[0] === type) {
                        elements.push({
                            type: types[type],
                            variableName: variableName,
                            value: requiredValue,
                            operator: operator
                        });
                    }
                });
            }
        });
        return elements;
    }
}
