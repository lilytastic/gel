import { Component } from '@angular/core';
import { trigger, animate, style, group, animateChild, keyframes, query, stagger, transition } from '@angular/animations';

import { ThemeService } from "./theme.service";

@Component({
  selector: 'app-root',
  animations: [ 
    trigger("routerTransition", [
      /*
      transition('* <=> *', [
        query(".wipe", [
          style({ height: "0", width: "100vw", top: "0" }),
          animate('1s ease-in-out', keyframes([
            style({ height: "0", top: "0" }),
            style({ height: "100vh", top: "0" }),
            style({ height: "100vh", top: "0" }),
            style({ top: "100vh", width: "100vw" }),
          ]))
        ])
      ]),
      */
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "gel";

  constructor(private themeService: ThemeService) { }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
