package mh.test.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mh.test.model.Employee;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class EmployeeController {

	private List<Employee> employees = createList();

	@RequestMapping(value = "/employees", method = RequestMethod.GET, produces = "application/json")
	public List<Employee> employees() {
		return employees;
	}

	@RequestMapping(value = "/employees", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> addEmployee(@RequestBody Employee employee) {

		if (employee.getSalary() < 10) {
			return new ResponseEntity<>("Below minimum wage", HttpStatus.BAD_REQUEST);
		} else {
			System.out.println("Received a new employee: " + employee.getName());
			employees.add(employee);
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}

	private static List<Employee> createList() {
		List<Employee> tempEmployees = new ArrayList<>();
		Employee emp1 = new Employee();
		emp1.setName("emp1");
		emp1.setDesignation("manager");
		emp1.setEmpId("1");
		emp1.setSalary(3000);
		Employee emp2 = new Employee();
		emp2.setName("emp2");
		emp2.setDesignation("developer");
		emp2.setEmpId("2");
		emp2.setSalary(3000);
		tempEmployees.add(emp1);
		tempEmployees.add(emp2);
		return tempEmployees;
	}
}