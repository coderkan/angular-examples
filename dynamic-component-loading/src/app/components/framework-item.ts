import { Type } from '@angular/core';

export class FrameworkItem {
  constructor(public component: Type<any>, public data: any) {}
}
