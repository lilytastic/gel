import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  isScrolling = false;

  constructor() { }

  scrollTo(bottom, speed = 300) {
    if (this.isScrolling) {
      return;
    }
    this.isScrolling = true;
    const scrollTarget = bottom;

    const start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const dist = scrollTarget - start;
    const duration = speed + speed * dist / 100;
    if (dist < 0) {
      this.isScrolling = false;
      return;
    }

    const self = this;
    let startTime = null;
    function step(time) {
      if (startTime == null) {
        startTime = time;
      }
      const t = (time - startTime) / duration;
      const lerp = 3 * t * t - 2 * t * t * t;
      if (window.scroll) {
        window.scroll(0, start + lerp * dist);
      } else if (document.body.scrollTo) {
        document.body.scrollTo(0, start + lerp * dist);
      } else {
        document.body.scrollTop = start + lerp * dist;
      }
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        self.isScrolling = false;
      }
    }
    requestAnimationFrame(step);
  }

}
