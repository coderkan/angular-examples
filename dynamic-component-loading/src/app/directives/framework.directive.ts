import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[framework-host]' })
export class FrameworkDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
