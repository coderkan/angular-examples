import { Component, OnInit, Input } from '@angular/core';
import { FrameworkComponent } from '../framework.component';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.scss']
})
export class ReactComponent implements OnInit, FrameworkComponent {

  @Input('data') data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
