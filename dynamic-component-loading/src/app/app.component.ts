import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { FrameworkItem } from './components/framework-item';
import { AngularComponent } from './components/angular/angular.component';
import { FrameworkDirective } from './directives/framework.directive';
import { FrameworkComponent } from './components/framework.component';
import { VueComponent } from './components/vue/vue.component';
import { ReactComponent } from './components/react/react.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'dynamic-comp-app';

  frameworks: FrameworkItem[];

  @ViewChild(FrameworkDirective, { static: true }) frameworkHost: FrameworkDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.frameworks = this.getFrameworkList();
    this.loadDynamicComponentsWithIndex(0);
  }

  loadDynamicComponentsWithIndex(ind: any) {
    const frameworkItem = this.frameworks[ind];

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(frameworkItem.component);

    const viewContainerRef = this.frameworkHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<FrameworkComponent>componentRef.instance).data = frameworkItem.data;
  }

  getFrameworkList() {
    return [
      new FrameworkItem(AngularComponent, { name: 'Angular' }),
      new FrameworkItem(VueComponent, { name: 'VueJS' }),
      new FrameworkItem(ReactComponent, { name: 'ReactJS' })
    ];
  }

}
