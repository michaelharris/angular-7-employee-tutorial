import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee }  from './../employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  apiURL: string = 'http://localhost:8890';
  constructor(private httpClient: HttpClient) {}


  public getEmployees(){
    console.log('get employees')
    return this.httpClient.get<Employee[]>(`${this.apiURL}/employees`);
}

save(employee: Employee): Observable<Object> {
  let result: Observable<Object>;
  
    result = this.httpClient.post(`${this.apiURL}/employees`, employee);

  return result;
}


}
