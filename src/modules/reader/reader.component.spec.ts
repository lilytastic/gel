import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderComponent } from './reader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InkService } from '@core/services/ink.service';
import { ThemeService } from '@core/services/theme.service';

import { Segment } from '@core/classes/segment';
import { Choice } from '@core/classes/choice';

import { PluralizePipe } from '@shared/pipes/pluralize.pipe';

describe('ReaderComponent', () => {
  let component: ReaderComponent;
  let fixture: ComponentFixture<ReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReaderComponent, PluralizePipe
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
