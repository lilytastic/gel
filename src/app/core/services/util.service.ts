import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  /* tslint:disable */
  checkWithOperator = {
    '=': function(val1, val2) { return val1 == val2; },
    '==': function(val1, val2) { return val1 == val2; },
    '===': function(val1, val2) { return val1 === val2; },
    '!=': function(val1, val2) { return val1 != val2; },
    '!==': function(val1, val2) { return val1 !== val2; },
    '>': function(val1, val2) { return val1 > val2; },
    '>=': function(val1, val2) { return val1 >= val2; },
    '<': function(val1, val2) { return val1 < val2; },
    '<=': function(val1, val2) { return val1 <= val2; },
  };
  /* tslint:enable */

  constructor() { }
}
