const connection = require("./config");

class DB {
    constructor(connection) {
        this.connection = connection;
    }
    findAllEmployees() {
        return this.connection.query("SELECT employee.id, first_name, last_name, salary, manager_id, department.name, role.title FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name;")
    }


}


module.exports = new DB(connection);