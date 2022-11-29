interface Employee { 
    uniqueId: number; 
    name: string; 
    subordinates: Employee[]; 
}

interface EmployeeMoveAction {
    from: number;
    to: number;
    employee: number;
}

interface IEmployeeOrgApp { 
    ceo: Employee;
    /** 
     * Moves the employee with employeeID (uniqueId) under a supervisor (another employee) that has supervisorID (uniqueId). * E.g. move Bob (employeeID) to be subordinate of Georgina (supervisorID). * 
     * @param employeeID
     * @param supervisorID */ 
    move(employeeID: number, supervisorID: number): void;

    /** Undo last move action */ 
    undo(): void;

    /** Redo last undone action */ 
    redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
    ceo: Employee;
    actions: EmployeeMoveAction[] = [];
    cursor: number = 0;

    constructor(ceo: Employee) {
        this.ceo = ceo;
        this.cursor = 0;
    }

    /* Finds specified employee with employeeID */
    findEmployee(employee: Employee, employeeID: number): any {
        if (employee.uniqueId == employeeID) {
            return employee;
        }
        
        for (var emp of employee.subordinates) {
            var foundEmp = this.findEmployee(emp, employeeID);
            if (foundEmp) {
                return foundEmp;
            }
        }
        return null;
    }

    /* Finds visor of specified employee with employeeID */
    findVisor(employee: Employee, employeeID: number): any {
        for (var visor of employee.subordinates) {
            if (visor.uniqueId == employeeID) {
                return employee;
            }
            var foundEmp = this.findVisor(visor, employeeID);
            if (foundEmp) {
                return foundEmp;
            }
        }
        return null;
    }

    /* Remove employee */
    removeEmployee(employee: Employee, employeeID: number): any {
        if (employee.uniqueId == employeeID) {
            return employee;
        }
        
        for (let i = 0; i < employee.subordinates.length; i ++) {
            var foundEmp = this.removeEmployee(employee.subordinates[i], employeeID);
            if (foundEmp) {
                if (foundEmp.uniqueId == employee.subordinates[i].uniqueId) {
                    employee.subordinates.splice(i, 1);
                }
                return foundEmp;
            }
        }
        return null;
    }
    
    /* Add employee to visor with supervisorID */
    addEmployee(supervisor: Employee, employee: Employee, supervisorID: number): any {
        if (supervisor.uniqueId == supervisorID) {
            supervisor.subordinates.push(employee);
        }
        
        for (var visor of supervisor.subordinates) {
            this.addEmployee(visor, employee, supervisorID);
        }
    }

    move(employeeID: number, supervisorID: number): void {
        var visor = this.findVisor(this.ceo, employeeID);
        var employee = this.removeEmployee(this.ceo, employeeID);
        if (!employee) {
            console.log("No matching employee.");
            return;
        }
        this.addEmployee(this.ceo, employee, supervisorID);
        this.actions.push({
            from: visor.uniqueId,
            to: supervisorID,
            employee: employeeID
        });
    }

    undo(): void {
        this.cursor--;
        if (this.actions.length + this.cursor < 0) {
            console.log("There are no move history");
            return;
        }
        var action = this.actions[this.actions.length + this.cursor];
        var employee = this.removeEmployee(this.ceo, action.employee);
        this.addEmployee(this.ceo, employee, action.from);
    }
    redo(): void {
        if (this.cursor == 0) {
            console.log("There are no more history.");
            return;
        }
        var action = this.actions[this.actions.length + this.cursor];
        var employee = this.removeEmployee(this.ceo, action.employee);
        this.addEmployee(this.ceo, employee, action.to);
        this.cursor ++;
    }
}

function main() {
    var ceo:Employee = {
        uniqueId: 1,
        name: "Mark Zuckerberg",
        subordinates: [
            {
                uniqueId: 2,
                name: "Sarah Donald",
                subordinates: [
                    {
                        uniqueId: 3,
                        name: "Cassandra Reynolds",
                        subordinates: [{
                            uniqueId: 4,
                            name: "Mary Blue",
                            subordinates: []
                        }, {
                            uniqueId: 5,
                            name: "Bob Saget",
                            subordinates: [{
                                uniqueId: 6,
                                name: "Tina Teff",
                                subordinates: [{
                                    uniqueId: 7,
                                    name: "Will Turner",
                                    subordinates: []
                                }]
                            }]
                        }]
                    }
                ]
            },
            {
                uniqueId: 8,
                name: "Tyler Simpson",
                subordinates: [{
                    uniqueId: 9,
                    name: "Harry Tobs",
                    subordinates: [{
                        uniqueId: 10,
                        name: "Thomas Brown",
                        subordinates: []
                    }]
                }, {
                    uniqueId: 11,
                    name: "George Carrey",
                    subordinates: []
                }, {
                    uniqueId: 12,
                    name: "Gary Styles",
                    subordinates: []
                }]
            },
            {
                uniqueId: 13,
                name: "Bruce Willis",
                subordinates: []
            },
            {
                uniqueId: 14,
                name: "Georgina Flangy",
                subordinates: [{
                    uniqueId: 15,
                    name: "Sophie Turner",
                    subordinates: []
                }]
            }
        ]
    };
    var app:EmployeeOrgApp = new EmployeeOrgApp(ceo);
    console.log(app.ceo);
    app.move(8, 13);
    console.log(app.ceo);
    app.undo();
    console.log(app.ceo);
    app.redo();
    console.log(app.ceo);
}

main();