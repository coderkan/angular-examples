#  Angular HttpInterceptor usage like Fake Backend.

Hi everyone,

I would like to show you how to use HttpInterceptor like fake backend in Angular project. If you are working as a front end developer, you always wait for backend developers to finish web services you need. In this case, we need to develop our application without web services. So the HttpInterceptor help us getting data with request. We could use as mock data.

There are many things we can do with HttpInterceptor.

They are;

- Fake backend
- Authentication
- Caching
- URL transformation
- Modifying headers
- ...

I will use as a FakeBackend.

I developed a simple application that can easily list, add and delete employees.

In this application, I changed the http requests according to my own wishes.

Employee Object;

```jsx
{
      "id": "b16ecd2b-596e-4453-a05c-fe10d6f1a4c2",
      "full_name": "Bard Corkan",
      "unit": "IT",
      "emp_avatar": "https://robohash.org/reprehenderitatquelaboriosam.jpg?size=36x36&set=set1"
}
```

Rest API endpoints.

`/employes`   `GET`    → get all employes.

`/employes`    `POST`  `body: EmployeeObject`  create a new employee.

`/employes/{public_employee_id}`  `DELETE` delete employee given public id. 

After determining the endpoints, we can start the steps of our project.

## Let's Begin

Firstly, I created a simple `employes.json` external file as a list of default employes.

After that I created an `employee-service` and implement it with `http-interceptor`.

Fake Backend HttpInterceptor source code like below;

We will change our request's and method's values when request occured. After the http request is created, we will capture the request in `HttpInterceptor` . We will catch them in the `HttpInterceptor` .  

I have written `handleRequest` method, it gives us two(2) parameters, first of one `request`, the another one is `next`http handler.

List of all employes,

I cloned original request and changed it's original url with **employeeJsonPath** variable.

```jsx
    private _employeeJsonPath = "assets/employes.json";
    
    const { url, method } = req;

    if (url.endsWith("/employes") && method === "GET") {
      req = req.clone({
        url: this._employeeJsonPath,
      });
      return next.handle(req).pipe(delay(500));
    }
```

Add a new employee to server code like below.

I cloned request body, because it has a new employee object in reqeuest body. After that object has no unique id as you see, I generate it and return as a `HttpResponse`.

In this area you can also use different things  in http response. You can return different `status`, different `body`, `header` or etc.

```jsx
    if (url.endsWith("/employes") && method === "POST") {
      const { body } = req.clone();
      // assign a new uuid to new employee
      body.id = uuidv4();
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }
```

Delete an employeee,

I have added  reg-ex to catch employee id in `/employes/{public-employe-id}`  url path and I want the method to be equal to the `DELETE` method.

I splitted the request url and get employe id and returned  this id in the request body.

```jsx
    if (url.match(/\/employes\/.*/) && method === "DELETE") {
      const empId = this.getEmployeeId(url);
      return of(new HttpResponse({ status: 200, body: empId })).pipe(
        delay(500)
      );
    }

  getEmployeeId(url: any) {
    const urlValues = url.split("/");
    return urlValues[urlValues.length - 1];
  }
```

Full source code for `fakebackend.ts`.

```jsx
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
```

After added `fakebackend.ts` HttpInterceptor, you need to add your `fakeBackendProvider` to your `app.module.ts` .

```jsx
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: [
    fakeBackendProvider   // --> This is very important...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

I have created `employe.service.ts` for interaction with fake backend.

It includes simple `get`, `post` an `delete` methods with `Observable`.

The `employee.service.ts` full source code like below. 

```jsx
@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  /**
   * Get All Employee request.
   */
  getAllEmployes(): Observable<any> {
    return this.http
      .get<any>("http://localhost:4200/employes", { observe: "response" })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  /**
   * Add a new employee post requts.
   * @param employee a new employee to add.
   */
  addEmployee(employee: any): Observable<any> {
    return this.http
      .post<any>("http://localhost:4200/employes", employee, {
        observe: "response",
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete an employee request method.
   * @param empId employee unique id
   */
  deleteEmployee(empId: any) {
    return this.http
      .delete<any>("http://localhost:4200/employes/" + empId, {
        observe: "response",
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
```

 

## Information about UI.

I have added a simple card to show an employe's full name, unit and avatar. It's very simple html code. I have used *ngFor for listing. And you will see delete icon on the right in card. You can easily delete a user with it.

 
Adding a new employee, I have created a simple form that has only fullname input and unit dropdown. You easily add a new user with it.

html source code like below. 

```html
<div class="card-container">
    <div class="card-container" style="display: block;">
      <p *ngFor="let emp of employes" class="card">
        <img src="{{ emp.emp_avatar }}" />
        <span>{{ emp.full_name }} </span>
        <span class="unit-name">{{ emp.unit }} </span>
        <i (click)="onDeleteAction(emp.id)" class="fa fa-trash delete-icon tooltip"><span class="tooltiptext"> Delete
            This Employee</span></i>
      </p>
    </div>
    <div style="text-align: center; margin-left: 30px;">
      <form>
        <ul class="form-style-1">
          <li>
            <label>Add Employee</label>
          </li>
          <li>
            <label>Full Name <span class="required">*</span></label>
            <input type="text" name="field1" class="field-divided" placeholder="Full Name" [(ngModel)]="employeeName" />
          </li>
          <li>
            <label>Subject</label>
            <select name="field4" class="field-select" [(ngModel)]="selectedDepart">
              <option value="IT">IT</option>
              <option value="AA">AA</option>
              <option value="HR">HR</option>
            </select>
          </li>
          <li>
            <button (click)="onAddEmployeeAction()" type="button">Add</button>
          </li>
        </ul>
      </form>
    </div>
  </div>
```

`app.component.ts` source code. 

Below code you will see the crud operations methods. I used `RxJS` in methods. 

```jsx
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [EmployeeService],
})
export class AppComponent implements OnInit {
  title = "http-interceptor-fakebackend";

  employes: any[];

  employeeName = "";

  selectedDepart: "";

  showLoading = false;

  constructor(private employeService: EmployeeService) {}

  ngOnInit(): void {
    this.getAllEmployesFromServer();
  }

  //#region  actions
  /**
   * Delete Action
   * @param empId employee unique id
   */
  onDeleteAction(empId: any) {
    this.deleteEmployeeFromServer(empId);
  }

  /**
   * Create a new employee object and send to the server to save.
   */
  onAddEmployeeAction() {
    // create new employee object
    let newEmployee = {
      id: "", // generate uuid on server.
      full_name: this.employeeName,
      unit: this.selectedDepart,
      emp_avatar:
        "https://robohash.org/" +
        this.employeeName.toLowerCase().trim().replace(/\s/g, "") +
        ".jpg?size=36x36&set=set1",
    };

    // validate inputs
    if (!this.isValid(newEmployee)) return;

    // add employee
    this.addEmployeeToServer(newEmployee);
  }

  //#endregion actions

  //#region  Communication between fake backend and UI methods.
  /**
   * Add a new employee object to server with http post.
   * @param newEmployee 
   */
  addEmployeeToServer(newEmployee: {
    id: string;
    full_name: string;
    unit: "";
    emp_avatar: string;
  }) {

    // show spinner
    this.showLoading = true;

    this.employeService.addEmployee(newEmployee).subscribe(
      (resp) => {
        if (resp.status == 200) {
          // add to list
          this.employes.push(resp.body);
          this.selectedDepart = "";
          this.employeeName = "";
        }
      },
      (err) => console.error("Error Occured When Add A New Employee " + err),
      () => (this.showLoading = false) // close spinner
    );
  }

  /**
   * Get All Employes from local .json file for a first time.
   */
  getAllEmployesFromServer() {
    this.showLoading = true;
    this.employeService.getAllEmployes().subscribe(
      (resp) => {
        if (resp.status == 200) {
          this.employes = resp.body;
        }
      },
      (err) => console.error("Error Occured When Get All Employes " + err),
      () => (this.showLoading = false)
    );
  }

  /**
   * Delete an employee from server with given employee uuid.
   * @param empId user public uuid
   */
  deleteEmployeeFromServer(empId: any) {
    this.showLoading = true;
    this.employeService.deleteEmployee(empId).subscribe(
      (resp) => {
        if (resp.status == 200) {
          const deletedEmpId = resp.body;
          // delete from array.
          this.employes = this.employes.filter((f) => f.id !== deletedEmpId);
        }
      },
      (err) => console.error("Error Occured When Delete An Employee " + err),
      () => (this.showLoading = false)
    );
  }
  //#endregion  Communication between fake backend and UI methods.

  /**
   * Validate employee object taken from form.
   * @param emp 
   */
  isValid(emp: any): boolean {
    if (
      emp.full_name == undefined ||
      emp.full_name == null ||
      emp.full_name == ""
    ) {
      alert("Please Enter Full Name");
      return false;
    }
    if (emp.unit == undefined || emp.unit == null || emp.unit == "") {
      alert("Please Select A Department");
      return false;
    }
    return true;
  }
}
```

Application YouTube Video.

[![](http://img.youtube.com/vi/Xf6CiCVK2Fo/0.jpg)](http://www.youtube.com/watch?v=Xf6CiCVK2Fo "")


# **Conclusion**

We can use HttpInterceptors for different purposes. It provides convenience during application development. So you can easily implement for your project for different purposes.

I hope you enjoy when reading.

Have a nice coding.
