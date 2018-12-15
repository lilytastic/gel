import { TestBed, inject } from '@angular/core/testing';

import { InkService } from './ink.service';
import { StoreModule } from '@ngrx/store';
import { SegmentReducer } from '@src/app/store/reducers/segment.reducer';

describe('InkService', () => {
  let service: InkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(SegmentReducer)],
      providers: [InkService]
    });
  });

  it('should be created', inject([InkService], (_service: InkService) => {
    service = _service;
    expect(service).toBeTruthy();
  }));
});
