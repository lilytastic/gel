import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Choice } from '@app/classes/choice';

import { ReaderChoiceComponent } from './reader-choice.component';
import { PluralizePipe } from '@shared/pipes/pluralize.pipe';
import { StoreModule } from '@ngrx/store';
import { ReaderReducers } from '@reader/store/reducers/segment.reducer';

describe('ReaderChoiceComponent', () => {
  let component: ReaderChoiceComponent;
  let fixture: ComponentFixture<ReaderChoiceComponent>;
  let button: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(ReaderReducers)
      ],
      declarations: [
        ReaderChoiceComponent,
        PluralizePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderChoiceComponent);
    button = fixture.nativeElement.querySelector('button');
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

  it('should emit the index on click', async() => {
    spyOn(component, 'onClick');
    button.click();
    await fixture.whenStable().then(() => {
      expect(component.onClick).toHaveBeenCalled();
    });
  });
});
