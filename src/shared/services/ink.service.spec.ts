import { TestBed, inject } from '@angular/core/testing';

import { InkService } from './ink.service';

describe('InkService', () => {
  let service: InkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InkService]
    });
  });

  it('should be created', inject([InkService], (_service: InkService) => {
    service = _service;
    expect(service).toBeTruthy();
  }));
});
