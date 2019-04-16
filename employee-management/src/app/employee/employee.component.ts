import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../service/http-client.service';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import {  Router, ActivatedRoute }   from '@angular/router';

import { Employee } from '../employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees:Employee[];
  name = new FormControl('');
  salary = new FormControl('');
  designation = new FormControl('');
  employeeForm: FormGroup;
  isSubmitted  =  false;
  statusInfo = ''


  constructor(
    private httpClientService:HttpClientService, private formBuilder: FormBuilder, private route:  ActivatedRoute,
    private router: Router){  }

  ngOnInit() {
    this.httpClientService.getEmployees().subscribe(
     response =>this.handleSuccessfulResponse(response),
    );

    this.employeeForm  =  this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', Validators.required]
  });


  }
handleSuccessfulResponse(response)
{
    this.employees=response;
}

get formControls() { return this.employeeForm.controls; }


save() {
  console.log(this.employeeForm.value);
    this.isSubmitted = true;
    if(this.employeeForm.invalid){
      return;
    }
  this.httpClientService.save(this.employeeForm.value).subscribe(result => {
    console.log('saved employee')
    this.employees.push(this.employeeForm.value)
    //this.gotoList();
    this.router.navigate(['../employees'], {relativeTo: this.route});
    this.statusInfo = 'OK'
  }, error => {
    console.error(error)
    this.statusInfo = error.error
  })
}

}
