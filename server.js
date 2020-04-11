const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");

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
    console.log("successful connection");
    start();

});

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Add Employee", "Add Role", "Add Department", "Quit"],
            name: "startChoice"
        }
    ])

        // Initial List of Options
        .then((answer) => {
            switch (answer.startChoice) {
                case "Quit":
                    console.log("Thanks for using my program!");
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

                default:
                    console.log("Please enter a valid answer")
                    start();
                    break;
            }
        })
}


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
                connection.end();
            }
        })


}


// add employee (connect to role_Id, manager_id)
function addEmployee() {
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
            type: "number",
            message: "Enter Employee Role ID: ",
            name: "role_id"
        },
        {
            type: "input",
            message: "Enter Employee Manager ID (Leave blank if none): ",
            name: "manager_id"
        }
    ])
        .then((answers) => {
            // check if manager id entered
            if (answers.manager_id) {
                // insert info w/ manager id if present
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (res, err) => {
                    if (err) throw err;
                    console.table();
                    endChoice();
                })

            } else {
                connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [answers.first_name, answers.last_name, answers.role_id], (res, err) => {
                    if (err) throw err;
                    endChoice();
                })
            }
        })
}

// add department with auto dept. number at each entry
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter Department Name:",
            name: "deptName"
        }
    ])
    .then((answers) => {
        connection.query("INSERT INTO department (name) VALUES (?)", [answers.deptName], (err, res) => {
            console.log(res.insertId)
            if (err) throw err;
            console.log(`New Department "${answers.deptName}" created with ID # ${res.insertId}`);
            endChoice();
        })
    })
}


function addRole() {
    console.log("add role");
    endChoice();
}