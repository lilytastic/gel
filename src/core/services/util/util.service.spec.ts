import { TestBed, inject } from '@angular/core/testing';

import { UtilityService } from './util.service';

describe('UtilityService', () => {
  let service: UtilityService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilityService]
    });
  });

  it('should be created', inject([UtilityService], (_service: UtilityService) => {
    expect(_service).toBeTruthy();
    service = _service;
  }));

  it('#checkWithOperator should return the correct values for each operator', (done: DoneFn) => {
    expect(service.checkWithOperator['=='](2, 2)).toBe(true);
    expect(service.checkWithOperator['===']('2', 2)).toBe(false);
    expect(service.checkWithOperator['==='](2, 2)).toBe(true);
    expect(service.checkWithOperator['!='](7, 2)).toBe(true);
    expect(service.checkWithOperator['!==']('7', 7)).toBe(true);
    expect(service.checkWithOperator['>='](8, 5)).toBe(true);
    expect(service.checkWithOperator['>=']('a', 5)).toBe(false);
    done();
  });
});
