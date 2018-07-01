import { TestBed, inject } from '@angular/core/testing';

import { InkService } from './ink.service';

describe('InkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InkService]
    });
  });

  it('should be created', inject([InkService], (service: InkService) => {
    expect(service).toBeTruthy();
  }));
});
