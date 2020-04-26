import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularComponent } from './components/angular/angular.component';
import { VueComponent } from './components/vue/vue.component';
import { ReactComponent } from './components/react/react.component';
import { FrameworkDirective } from './directives/framework.directive';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
    VueComponent,
    ReactComponent,
    FrameworkDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  entryComponents: [AngularComponent, VueComponent, ReactComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
