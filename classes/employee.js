const Role = require("./role");

class Employee extends Role {
    constructor(id, first_name, last_name, role_id, manager_id){
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.manager_id = manager_id;
        super(id);
        super.id = role_id;


    }


}

module.exports = Employee;