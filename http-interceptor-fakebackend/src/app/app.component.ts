import { Component, OnInit } from "@angular/core";
import { EmployeeService } from "./services/employee.service";

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
