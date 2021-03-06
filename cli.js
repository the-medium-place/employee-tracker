const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");
var figlet = require('figlet');

// make the connections
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employees_db"
});

// what to do with connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.clear();
    start();

});

// Display Logo and get Initial Action Choice
function start() {
    console.clear();
    displayBigLogo("\n<Employee\n  Manager>");


    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "View All Departments", "View All Roles", "View All Roles by Department", "View all Employees", "View Employee by Manager", "Update Employee Manager", "Update Employee Role", "Get Utilized Budget by Department", "Delete Employee", "Delete Role", "Delete Department", "Quit"],
            name: "startChoice"
        }
    ])

        // Initial List of Options
        .then((answer) => {
            switch (answer.startChoice) {

                case "Quit":
                    console.clear();
                    displaySmallLogo("Goodbye!");
                    connection.end();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "View All Departments":
                    viewAllDepts();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "View all Employees":
                    viewAllEmployees();
                    break;

                case "Update Employee Manager":
                    updateManager();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "View All Roles by Department":
                    viewRolesByDept();
                    break;

                case "View Employee by Manager":
                    viewEmployeesByManager();
                    break;

                case "Get Utilized Budget by Department":
                    getUtilizedBudget();
                    break;

                case "Delete Employee":
                    deleteEmployee();
                    break;

                case "Delete Role":
                    deleteRole();
                    break;

                case "Delete Department":
                    deleteDepartment();
                    break;

                default:
                    console.log("Please enter a valid answer")
                    start();
                    break;
            }
        })
};

// end of each function - go back or quit?
function endChoice() {

    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do now?",
            choices: ["Back to Start", "Quit"],
            name: "endChoice"
        }
    ])
        .then((answer) => {
            if (answer.endChoice === "Back to Start") {
                start();
            } else {
                console.clear();
                displaySmallLogo("Goodbye!");
                connection.end();
            }
        })
};

//======================
// BEGIN USER ACTION FUNCTIONS
//======================

function addEmployee() {
    console.clear();
    displaySmallLogo("Add Employee");

    // get list of role titles and list of role objects (with title and id)
    const roleTitlesArr = [];
    const roleInfoArr = [];

    connection.query("SELECT id, title FROM role", (err, res) => {
        if (err) throw err;

        for (i in res) {
            const newRoleObj = {};
            newRoleObj.id = res[i].id;
            newRoleObj.title = res[i].title;

            roleInfoArr.push(newRoleObj);
            roleTitlesArr.push(res[i].title);
        }


        // get list of employee names  and list of employe objects (with name and id)
        const empNamesArr = [];
        const empInfoArr = [];

        connection.query("SELECT id, first_name, last_name FROM employee", (err, res) => {
            if (err) throw err;

            for (i in res) {
                const newEmpObj = {};
                newEmpObj.id = res[i].id;

                const fullName = `${res[i].first_name} ${res[i].last_name}`;
                newEmpObj.name = fullName;

                empInfoArr.push(newEmpObj);
                empNamesArr.push(fullName);

            }


            // get user input
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter Employee First Name: ",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "Enter Employee Last Name: ",
                    name: "last_name"
                },
                {
                    type: "list",
                    message: "Enter New Employee Role: ",
                    choices: roleTitlesArr,
                    name: "role_id"
                },
                {
                    type: "confirm",
                    message: "Enter Manager for New Employee?",
                    name: "manager_bool"
                },
                {
                    type: "list",
                    message: "Select Manager for New Employee:",
                    choices: empNamesArr,
                    name: "manager_name",
                    when: function (answers) {
                        if (answers.manager_bool === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ])
                .then((answers) => {

                    // get manager id from name given
                    let managerId;
                    for (i in empInfoArr) {
                        if (empInfoArr[i].name === answers.manager_name) {

                            managerId = empInfoArr[i].id;
                        }
                    }

                    // get role id from title given
                    let roleId;
                    for (i in roleInfoArr) {
                        if (answers.role_id === roleInfoArr[i].title) {

                            roleId = roleInfoArr[i].id;
                        }
                    }

                    // add new employee to database using all gathered information

                    if (answers.manager_bool = true) {

                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answers.first_name, answers.last_name, roleId, managerId], (err, res) => {
                            if (err) throw err;
                            console.log("Employee Added Successfully");

                            endChoice();
                        })

                    } else {

                        connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [answers.first_name, answers.last_name, roleId], (err, res) => {
                            if (err) throw err;
                            console.log("Employee Added Successfully")

                            endChoice();
                        })
                    }
                })

        })
    })
    // here and here

};

function addDepartment() {
    console.clear();
    displaySmallLogo("Add Department");
    inquirer.prompt([
        {
            type: "input",
            message: "Enter Department Name:",
            name: "deptName"
        }
    ])
        .then((answers) => {
            connection.query("INSERT INTO department (name) VALUES (?)", [answers.deptName], (err, res) => {
                if (err) throw err;
                console.log(`"${answers.deptName}" Added as new Department`);

                endChoice();
            })
        })


};

function addRole() {
    console.clear();
    displaySmallLogo("Add Role");
    // get all dept names into array of key/value pairs
    const deptArr = [];

    connection.query("SELECT id, name FROM department;", (err, res) => {
        if (err) throw err;

        for (i in res) {
            newObj = {};
            newObj.id = res[i].id;
            newObj.name = res[i].name;
            deptArr.push(newObj);
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Enter Department for new role: ",
                choices: deptArr, // array of department names
                name: "deptName"
            },
            {
                type: "input",
                message: "Enter Role Title:",
                name: "roleName"
            },
            {
                type: "number",
                message: "Enter Salary for new role:",
                name: "salary"
            }

        ])
            .then((answers) => {

                // capture department ID of user choice for use in SQL query
                let dept_id;
                for (i in deptArr) {
                    if (deptArr[i].name === answers.deptName) {
                        dept_id = deptArr[i].id;
                    }
                }
                // add info to SQL database 
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answers.roleName, answers.salary, dept_id], (err, res) => {
                    if (err) throw err;
                    console.log("Role Added");
                    endChoice();
                })
            })
    })
};

function viewAllDepts() {
    console.clear();
    displaySmallLogo("Departments:");

    connection.query(`SELECT name AS "Current Department List" FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        endChoice();
    })

};

function viewAllRoles() {
    console.clear();
    displaySmallLogo("Roles:");
    connection.query(`SELECT title AS "Current Roles List", department.name AS Department, salary AS "Base Salary" FROM role JOIN department ON role.department_id = department.id ORDER BY department.name`, (err, res) => {
        if (err) throw err;
        console.table(res);
        endChoice();
    })


};

function viewAllEmployees() {
    console.clear();
    displaySmallLogo("Employees:");
    connection.query(`SELECT employee.id, first_name, last_name, salary, manager_id, department.name, role.title FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name;`, (err, res) => {
        if (err) throw err;

        const newEmpArr = [];
        for (i in res) {
            const newObj = {};
            // create new object for info after it has been arranged
            newObj.Name = `${res[i].first_name} ${res[i].last_name}`;
            newObj.Role = res[i].title;
            newObj.Department = res[i].name;
            newObj.Salary = `$${res[i].salary} / Year`;
            for (j in res) {
                if (res[i].manager_id === res[j].id) {
                    newObj.Manager = `${res[j].first_name} ${res[j].last_name}`;
                }
            }
            // push new object to array
            newEmpArr.push(newObj);

        }
        // display formatted table
        console.table(newEmpArr);
        endChoice();
    })

};

function updateManager() {
    console.clear();
    displaySmallLogo("Update Manager");

    //capture list of employee names
    const nameList = [];
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, res) => {
        if (err) throw err;
        for (i in res) {
            nameList.push(`${res[i].first_name} ${res[i].last_name}`);
        }

        // capture employee to update with inquirer
        inquirer.prompt([
            {
                type: "list",
                message: "Select Employee to Update:",
                choices: nameList,
                name: "empChoice"
            },
            {
                type: "list",
                message: `Select New Manager for this Employee`,
                choices: nameList,
                name: "newManager"
            }
        ])
            .then((answers) => {
                //  capture new manager ID # for use in emp schema
                let managerId;
                for (i in res) {
                    if (`${res[i].first_name} ${res[i].last_name}` === answers.newManager) {
                        managerId = res[i].id;
                    }
                }
                if (answers.empChoice === answers.newManager) {
                    console.log("Employee and Manager Cannot Match!\nPlease Try Again...");
                    updateManager();
                } else {
                    connection.query(`UPDATE employee SET manager_id = ? WHERE CONCAT(first_name, " ", last_name) = ?`, [managerId, answers.empChoice], (err, res) => {
                        if (err) throw err;
                        console.log("Employee Manager Successfully Updated");
                        endChoice();
                    })
                }
            })
    })
};

function updateEmployeeRole() {
    console.clear();
    displaySmallLogo("Update Role");

    // get list of employee names  and list of employe objects (with name and id)
    const empNamesArr = [];
    let empInfoArr;

    // get list of role titles and list of role objects (with title and id)
    const roleTitlesArr = [];
    let roleInfoArr;



    connection.query("SELECT id, title FROM role", (err, roleData) => {
        if (err) throw err;
        for (j in roleData) {
            roleTitlesArr.push(roleData[j].title)
        }



        // info from employee table
        connection.query("SELECT id, first_name, last_name FROM employee", (err, empData) => {
            if (err) throw err;
            for (i in empData) {
                empInfoArr = empData;
                const fullName = `${empData[i].first_name} ${empData[i].last_name}`;

                empNamesArr.push(fullName);

                roleInfoArr = empData;
            }
            // inquire for employee to update using list of names
            inquirer.prompt([
                {
                    type: "list",
                    message: "Select Employee for Role Change",
                    choices: empNamesArr,
                    name: "empChoice"
                },
                // inquire for new role using list of roles
                {
                    type: "list",
                    message: "Select New Role for Employee",
                    choices: roleTitlesArr,
                    name: "newRole"
                }
            ])
                .then((answers) => {
                    // get id for role entered
                    let roleId;
                    for (i in roleData) {
                        if (roleData[i].title === answers.newRole) {
                            roleId = roleData[i].id;
                        }
                    }
                    console.log("new role id: " + roleId);
                    // then update employee role
                    connection.query(`UPDATE employee SET role_id = ? WHERE CONCAT(first_name, " ", last_name) = ?`, [roleId, answers.empChoice], (err, res) => {
                        if (err) throw err;
                        console.log("Employee Roll Updated Successfully");
                        endChoice();
                    })
                })

        })
    })

};

function viewRolesByDept() {
    console.clear();
    displaySmallLogo("Roles by Department");


    // get list of department names, ids (query for all info from department table)
    connection.query("SELECT id, name FROM department;", (err, res) => {
        const deptNames = [];
        for (i in res) {
            deptNames.push(res[i].name);
        }
        // inquire for department from list
        inquirer.prompt([
            {
                type: "list",
                message: "Select Department to view Roles",
                choices: deptNames,
                name: "deptName"
            }
        ])
            .then((answer) => {
                // get id of selected department
                let deptId;
                for (j in res) {
                    if (answer.deptName === res[j].name) {
                        deptId = res[j].id;
                    }
                }
                // get all roles with matching dept number

                connection.query("SELECT title, salary FROM role WHERE department_id = ?", [deptId], (err, roleData) => {
                    console.table(roleData);
                    endChoice();

                })//end of second connection query


            })//end of inquirer section
    })//end of first connection query



};

function viewEmployeesByManager() {
    console.clear();
    displaySmallLogo("Employee Lookup");

    // get list of employees who are managers
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, empData) => {
        if (err) throw err;

        // const manIdList = [];
        const manNameList = [];
        for (i in empData) {

            // manIdList.push(empData[i].manager_id);
            // if (empData[i].manager_id) manIdList.push(empData[i].manager_id);

            for (j in empData) {
                // if manager id equals any employee ids
                if (empData[j].manager_id === empData[i].id) {

                    manNameList.push(`${empData[i].first_name} ${empData[i].last_name}`);
                }
            }
        }

        inquirer.prompt([
            {
                // inquire for manager to view
                type: "list",
                message: "Select Manager to view Employees",
                choices: manNameList,
                name: "managerChoice"
            }
        ])
            .then((answer) => {
                let manId;
                for (k in empData) {
                    if (answer.managerChoice === `${empData[k].first_name} ${empData[k].last_name}`) {
                        manId = empData[k].id;
                    }
                }

                connection.query(`SELECT first_name AS "First Name", last_name AS "Last Name", title AS "Role", department.name AS "Department", salary AS "Salary" FROM employee JOIN role ON role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.manager_id = ?`, [manId], (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    endChoice();
                })
            })
    })
};

function getUtilizedBudget() {
    console.clear();
    displaySmallLogo("Dept Budget");

    // const newquery = `SELECT COUNT(role_id) AS role_count, title, salary, name FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id GROUP BY title;`
    // capture 
    // get count (from employee table using role_id), title (role), salary (role), 
    // department name (from role name using department_id)
    const newquery = `SELECT COUNT(role_id) AS role_count, role.title, role.salary, department.name FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id GROUP BY role_id; `
    connection.query(newquery, (err, res) => {
        // if(err) throw err;
        // console.log(res);
        // add up cost for each role
        const totalCostObjs = [];
        const deptList = [];
        for (i in res) {
            const newObj = {};
            newObj.role = res[i].title;
            newObj.total_cost = res[i].salary * res[i].role_count;
            newObj.dept = res[i].name;
            totalCostObjs.push(newObj);
            deptList.push(res[i].name);
            
        }
        // remove duplicate entries
        const uniqueJobsList = [... new Set(deptList)]

        // console.log(totalCostObjs);
        // console.log(deptList);
        // endChoice();


        inquirer.prompt([
            {
                type: "list",
                message: "Select Department to view Utilized Budget",
                choices: uniqueJobsList,
                name: "deptChoice"
            }
        ])
            .then((answer) => {
                let totalBudget = 0;
                for (j in totalCostObjs) {
                    if (totalCostObjs[j].dept === answer.deptChoice) {
                        totalBudget += totalCostObjs[j].total_cost;
                    }

                }
                console.table([{ Department: answer.deptChoice, Budget: `$${totalBudget}` }]);
                endChoice();
            })
    })




    // separate roles by department

};

function deleteEmployee() {
    console.clear();
    displaySmallLogo("Delete Employee");

    const empNamesArr = [];
    const manNameList = [];

    // query for employee info (with ids and manager ids)
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, empData) => {
        if (err) throw err;
        // get list of employees for inquiry
        for (i in empData) {
            empNamesArr.push(`${empData[i].first_name} ${empData[i].last_name}`);
        }

        // get list of employees who are managers
        for (k in empData) {
            for (j in empData) {
                if (empData[j].manager_id === empData[k].id) {
                    manNameList.push(`${empData[k].first_name} ${empData[k].last_name}`);
                }
            }
        }
 
        // inquire for employee to delete
        inquirer.prompt([
            {
                type: "list",
                message: "Select Employee to Delete (Managers cannot be Deleted!)",
                choices: empNamesArr,
                name: "delChoice"
            }
        ])
            // compare user choice to manager name list
            .then((answer) => {

                if(manNameList.includes(answer.delChoice)){
                    // redirect user if on manager list
                    console.log(`\n${answer.delChoice} is a Manager and cannot be deleted\nNOTE: To delete a manager, all employees under that manager must be reassigned\n(Select 'Update Employee Manager' on Main Menu\n\n`);
                    endChoice();

                } else {
                 
                    // get employee id
                    let empId;
            
                    for (l in empData){
                        if (answer.delChoice === `${empData[l].first_name} ${empData[l].last_name}`){
                            empId = empData[l].id;
                        }
                    }

                    // delete employee
                    connection.query(`DELETE FROM employee WHERE id = ?`,[empId], (err, response) => {
                        if (err) throw err;
                        console.log("Employee Successfully Deleted")

                        // send to end choice
                        endChoice();
                    })
                }
            })// end of inquiry
    })// end of connection query
};

function deleteRole() {
    console.clear();
    displaySmallLogo("Delete Role");

    // get list of all roles plus ids of employees in that role (and NULL for empty roles)
    connection.query(`SELECT title, COUNT(employee.id) AS count FROM role LEFT JOIN employee ON role.id = employee.role_id GROUP BY employee.id;`, (err, roleData) => {
        if (err) throw err;
        console.table(roleData);
        const roleTitlesArr = [];
        const filledRolesArr = [];
        for (i in roleData){
            roleTitlesArr.push(`${roleData[i].title}`);
            if(roleData[i].count !== 0){
                filledRolesArr.push(roleData[i].title);
            }
        }

        // inquire for role to delete
        inquirer.prompt([
            {
                type: "list",
                message: "Select Role to Delete. Filled roles cannot be deleted!",
                choices: roleTitlesArr,
                name: "roleChoice"
            }
        ])
        // compare choice to list of roles with employees
        .then((answer) => {
            if(filledRolesArr.includes(answer.roleChoice)){
                console.log(`\n\nThe role of ${answer.roleChoice} is filled and cannot be deleted!\nNOTE: To delete a role All employees in that role must be reassigned\nSelect "Update Employee Role" on Main Menu\n`);
                endChoice();
            } else {
                // delete role from table
                connection.query(`DELETE FROM role WHERE title = ?`,[answer.roleChoice], (err, res) => {
                    if (err) throw err;
                    console.log("Role Successfully Deleted");

                    endChoice();
                })
            }
        })
    })
};

function deleteDepartment() {
    console.clear();
    displaySmallLogo("Delete Dept");

    // get list of departments and count of roles in dept
    const deptNameArr = [];
    const filledDeptArr = [];
    connection.query(`SELECT name, COUNT(role.id) AS count FROM department LEFT JOIN role ON department_id = department.id GROUP BY name`, (err, deptData) => {
        for(i in deptData){
            deptNameArr.push(deptData[i].name);
            if(deptData[i].count !== 0){
                filledDeptArr.push(deptData[i].name);
            }
        }

        // inquire for department to delete
        inquirer.prompt([
            {
                type: "list",
                message: "Select Department to Delete. Filled Departments cannot be Deleted!",
                choices: deptNameArr,
                name: "deptChoice"
            }
        ])
        // compare choice to list of filled depts
        .then((answer) => {
            // redirect if filled dept
            if(filledDeptArr.includes(answer.deptChoice)){
                console.log(`\nThe ${answer.deptChoice} department has listed Roles on file and cannot be deleted!\nNOTE: To delete a department, first delete all roles in that department\n(Select 'Delete Role' in Main Menu)\n`);
                endChoice();
            } else {
                // delete if not
                connection.query(`DELETE FROM department WHERE name = ?`, [answer.deptChoice], (err, res) => {
                    if (err) throw err;
                    console.log("Department Successfully Deleted");
                    endChoice();
                })
            }
        })
    })// end of connection query

    






};


//======================
// BEGIN ASCII STYLE FUNCTIONS
//======================

// Big Main Logo Ascii Font
function displayBigLogo(string) {
    console.log(figlet.textSync(string, {
        font: 'Colossal',
        horizontalLayout: 'fitted',
        verticalLayout: 'default'
    }));

};

// Small logo ascii font
function displaySmallLogo(string) {
    console.log(figlet.textSync(string, {
        font: 'Standard',
        horizontalLayout: 'fitted',
        verticalLayout: 'default'
    }));
};