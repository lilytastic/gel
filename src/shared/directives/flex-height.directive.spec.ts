import { ElementRef, Renderer, Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FlexHeightDirective } from './flex-height.directive';

@Component({
  template: `
    <div flexHeight>
      <div style="height: 100px;"></div>
    </div>
  `
})
class TestComponent { }

describe('FlexHeightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ FlexHeightDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();

    des = fixture.debugElement.queryAll(By.directive(FlexHeightDirective));
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
