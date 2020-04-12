const Department = require("./department");

class Role extends Department {

    constructor(id, title, salary, dept_name){
        this.id = id;
        this.title = title;
        this.salary = salary;
        
        super(name);
        super.name = dept_name;
    }
}

module.exports = Role;