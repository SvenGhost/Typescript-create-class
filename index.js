"use strict";
class EmployeeOrgApp {
    constructor(ceo) {
        this.actions = [];
        this.cursor = 0;
        this.ceo = ceo;
        this.cursor = 0;
    }
    /* Finds specified employee with employeeID */
    findEmployee(employee, employeeID) {
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
    findVisor(employee, employeeID) {
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
    removeEmployee(employee, employeeID) {
        if (employee.uniqueId == employeeID) {
            return employee;
        }
        for (let i = 0; i < employee.subordinates.length; i++) {
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
    addEmployee(supervisor, employee, supervisorID) {
        if (supervisor.uniqueId == supervisorID) {
            supervisor.subordinates.push(employee);
        }
        for (var visor of supervisor.subordinates) {
            this.addEmployee(visor, employee, supervisorID);
        }
    }
    move(employeeID, supervisorID) {
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
    undo() {
        this.cursor--;
        if (this.actions.length + this.cursor < 0) {
            console.log("There are no move history");
            return;
        }
        var action = this.actions[this.actions.length + this.cursor];
        var employee = this.removeEmployee(this.ceo, action.employee);
        this.addEmployee(this.ceo, employee, action.from);
    }
    redo() {
        if (this.cursor == 0) {
            console.log("There are no more history.");
            return;
        }
        var action = this.actions[this.actions.length + this.cursor];
        var employee = this.removeEmployee(this.ceo, action.employee);
        this.addEmployee(this.ceo, employee, action.to);
        this.cursor++;
    }
}
function main() {
    var ceo = {
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
    var app = new EmployeeOrgApp(ceo);
    console.log(app.ceo);
    app.move(8, 13);
    console.log(app.ceo);
    app.undo();
    console.log(app.ceo);
    app.redo();
    console.log(app.ceo);
}
main();
