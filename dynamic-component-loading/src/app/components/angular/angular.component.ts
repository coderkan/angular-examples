import { Component, OnInit, Input } from '@angular/core';
import { FrameworkComponent } from '../framework.component';

@Component({
  selector: 'app-angular',
  templateUrl: './angular.component.html',
  styleUrls: ['./angular.component.scss']
})
export class AngularComponent implements OnInit, FrameworkComponent{

  @Input('data') data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
