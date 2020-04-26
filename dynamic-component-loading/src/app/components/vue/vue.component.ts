import { Component, OnInit, Input } from '@angular/core';
import { FrameworkComponent } from '../framework.component';

@Component({
  selector: 'app-vue',
  templateUrl: './vue.component.html',
  styleUrls: ['./vue.component.scss']
})
export class VueComponent implements OnInit, FrameworkComponent {
  
  @Input('data') data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
