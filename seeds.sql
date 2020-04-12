USE employees_db;

INSERT INTO department (name)
VALUES ("HR"),
("Finance"),
("Accounts Payable");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 60000, 2),
("AP-Cleark", 35000, 3),
("AP-Manager", 80000, 3),
("HR Support", 40000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 3, 2),
("Julie", "Doe", 3, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jim", "Doe", 1),
("Jorp", "Doe", 1),
("Joop", "Doe", 2);