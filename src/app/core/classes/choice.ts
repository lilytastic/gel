import { FUNCTION_TYPE, variable } from "@angular/compiler/src/output/output_ast";

import { InkService } from "@core/services/ink.service";

export class Choice {
    index: number
    text: string
    metadata: any[]

    constructor(choice: any) {
        this.index = choice.index;
        this.metadata = [];

        var self = this;
        var operators = [">=","<=",">","<","!=","==","="]

        var compiledText:string = choice.text;
        var bracketOpen = compiledText.indexOf("(");
        var bracketClose = compiledText.indexOf(")", bracketOpen);
        if (bracketOpen !== -1) {
            var metadata = compiledText.substr(bracketOpen+1,bracketClose-bracketOpen-1);
            var tokens = metadata.split(","); 
            tokens.forEach(function(t){
                t = t.trim();
                var operator = "";
                var operatorIndex = -1;
                for (var i = 0; i < operators.length; i++) {
                    operatorIndex = t.indexOf(operators[i],1);
                    if (operatorIndex!==-1) {
                        operator = operators[i];
                        if (operator === "=") {operator = "==";}
                        break;
                    }
                }
                if (operator) {
                    var variableName = t.substr(1,operatorIndex-1).trim();
                    var requiredValue = +(t.substr(operatorIndex+operator.length).trim());
                }
                switch (t[0]) {
                    case "&":
                        self.metadata.push({
                            type: "requirement",
                            variableName: variableName,
                            value: requiredValue,
                            operator: operator
                        });
                        break;
                    case "$":
                        self.metadata.push({
                            type: "cost",
                            variableName: variableName,
                            value: requiredValue,
                            operator: operator
                        });
                        break;
                    default:
                        break;
                }
            })

            compiledText = compiledText.splice(bracketOpen,bracketClose+1).trim();
        }
        this.text = compiledText;
    }
}