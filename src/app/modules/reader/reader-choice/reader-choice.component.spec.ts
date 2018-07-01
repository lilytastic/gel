import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Choice } from '@core/classes/choice';

import { ReaderChoiceComponent } from './reader-choice.component';
import { PluralizePipe } from '@shared/pipes/pluralize.pipe';

describe('ReaderChoiceComponent', () => {
  let component: ReaderChoiceComponent;
  let fixture: ComponentFixture<ReaderChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReaderChoiceComponent,
        PluralizePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderChoiceComponent);
    component = fixture.componentInstance;
    component.choice = new Choice({
      text: '',
      index: 0
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
