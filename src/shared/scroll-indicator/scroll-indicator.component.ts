import { Component, OnInit, Input } from '@angular/core';
import { ScrollService } from '@app/services/scroll.service';

@Component({
  selector: 'scroll-indicator',
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.scss']
})
export class ScrollIndicatorComponent implements OnInit {
  @Input() scrollTarget = 0;

  constructor(private scrollService: ScrollService) { }

  ngOnInit() {
  }

  clickHandler(): void {
    this.scrollService.scrollTo(this.scrollTarget, 100);
  }

}
