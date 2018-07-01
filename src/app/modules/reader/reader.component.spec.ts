import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderComponent } from './reader.component';
import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PluralizePipe } from '@shared/pipes/pluralize.pipe';

describe('ReaderComponent', () => {
  let component: ReaderComponent;
  let fixture: ComponentFixture<ReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReaderComponent,
        ReaderChoiceComponent,
        PluralizePipe
      ],
      imports: [
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
