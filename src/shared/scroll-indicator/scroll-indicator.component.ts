import { Component, OnInit, Input, HostListener, AfterViewInit } from '@angular/core';
import { ScrollService } from '@app/services/scroll.service';

@Component({
  selector: 'scroll-indicator',
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.scss']
})
export class ScrollIndicatorComponent implements OnInit, AfterViewInit {
  @Input() scrollTarget = 0;

  scrolledPast = true;

  constructor(private scrollService: ScrollService) { }

  @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
    this.checkIfScrolledPastChoices();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    window.requestAnimationFrame(() => { this.checkIfScrolledPastChoices(); });
  }

  clickHandler(): void {
    const target = window.scrollY + this.scrollTarget - window.innerHeight + 20;
    this.scrollService.scrollTo(target, 100);
  }

  checkIfScrolledPastChoices(): void {
    this.scrolledPast = window.innerHeight > this.scrollTarget;
  }


}
