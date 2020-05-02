import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  // default employes json path
  private _employeeJsonPath = "assets/employes.json";

  constructor(private http: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }

  /**
   * Handle request's and support with mock data.
   * @param req
   * @param next
   */
  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    const { url, method } = req;

    if (url.endsWith("/employes") && method === "GET") {
      req = req.clone({
        url: this._employeeJsonPath,
      });
      return next.handle(req).pipe(delay(500));
    }
    if (url.endsWith("/employes") && method === "POST") {
      const { body } = req.clone();
      // assign a new uuid to new employee
      body.id = uuidv4();
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }
    if (url.match(/\/employes\/.*/) && method === "DELETE") {
      const empId = this.getEmployeeId(url);
      return of(new HttpResponse({ status: 200, body: empId })).pipe(
        delay(500)
      );
    }
    // if there is not any matches return default request.
    return next.handle(req);
  }

  /**
   * Get Employee unique uuid from url.
   * @param url
   */
  getEmployeeId(url: any) {
    const urlValues = url.split("/");
    return urlValues[urlValues.length - 1];
  }
}

/**
 * Mock backend provider definition for app.module.ts provider.
 */
export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendHttpInterceptor,
  multi: true,
};
