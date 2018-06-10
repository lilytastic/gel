import { Component, OnInit } from '@angular/core';
import { InkService } from "../ink.service";

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit {

  constructor(private ink: InkService) { 
    console.log(ink.Continue());
  }

  ngOnInit() {
  }

}
