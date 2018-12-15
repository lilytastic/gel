import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderSegmentComponent } from './reader-segment.component';
import { Segment } from '@app/classes/segment';

describe('ReaderSegmentComponent', () => {
  let component: ReaderSegmentComponent;
  let fixture: ComponentFixture<ReaderSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderSegmentComponent);
    component = fixture.componentInstance;
    component.segment = new Segment([
      {text: 'test'}
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
