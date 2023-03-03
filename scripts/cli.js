const inquirer = require('inquirer');
const mysql = require('mysql2');
const { join } = require('path');
const format = require('./format');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'management_db'
  },
);

class CLI {
    constructor() {}
    
    run() {
      return inquirer
      .prompt([
        {
          type: 'list',
          name: 'mgrOption',
          message: 'What would you like to do?',
          choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
      ])
      .then(( {mgrOption} ) => {    
        switch (mgrOption) {
            case "View All Employees":
              this.viewAllEmployees();
              break;
            case "Add Employee":
              this.addEmployee();
              break;
            case "Update Employee Role": 
              this.updateEmployeeRole();
              break;
            case "View All Roles":
              this.viewAllRoles();
              break;
            case "Add Role":
              this.addRole();
              break;
            case "View All Departments":
              this.viewAllDepartments();
              break;
            case "Add Department":
              this.addDepartment();
              break;
            case "Quit":
              process.exit();
            default:
              console.log("default case");
        }
      });
    }


    async updateEmployeeRole() {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [employees, fields1] = await conn.execute('SELECT first_name, last_name FROM employee');
      var employeeArray = new Array();
      for (var i = 0; i < employees.length; i++) {
        employeeArray.push(employees[i].first_name + " " + employees[i].last_name);
      }

      const [roles, fields2] = await conn.execute('SELECT title FROM role');
      var roleArray = new Array();
      for (var i = 0; i < roles.length; i++) {
        roleArray.push(roles[i].title);
      }

      const res = await inquirer.prompt([
        {
        type: 'list',
        name: 'employeeName',
        message: 'Which employee do you want to update?',
        choices: employeeArray
        },
        {
          type: 'list',
          name: 'newRole',
          message: 'Which role do you want to assign the selected employee?',
          choices: roleArray
        }
      ]);

      const [role, fields3] = await conn.execute('SELECT id FROM role WHERE title = "' + res.newRole + '"');
      const roleId = role[0].id;

      const fname = res.employeeName.split(" ")[0];
      const lname = res.employeeName.split(" ")[1];


      const [result, fields5] = await conn.execute('UPDATE employee SET role_id = "' + roleId + '" WHERE first_name = "' + fname + '" AND last_name = "' + lname + '"');

      this.viewAllEmployees();
    }




    async addEmployee() {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [titles, fields1] = await conn.execute('SELECT title FROM role');
      var roles = new Array();
      for (var i = 0; i < titles.length; i++) {
        roles.push(titles[i].title);
      }

      const [managers, fields2] = await conn.execute('SELECT first_name, last_name FROM employee');
      var mgrs = new Array();
      for (var i = 0; i < managers.length; i++) {
        mgrs.push(managers[i].first_name + " " + managers[i].last_name);
      }
      mgrs.push("None");

      const res = await inquirer.prompt([
        {
        type: 'text',
        name: 'firstName',
        message: 'What is the first name of the employee?'
        },
        {
          type: 'text',
          name: 'lastName',
          message: 'What is the last name of the employee?'
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the role of the employee?',
          choices: roles
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is the manager?',
          choices: mgrs
        }
      ]);

      const [role, fields3] = await conn.execute('SELECT id FROM role WHERE title = "' + res.role + '"');
      const roleId = role[0].id;

      var mgrId = "";
      if (res.manager != "None") {
        const fname = res.manager.split(" ")[0];
        const lname = res.manager.split(" ")[1];
        const [manager, fields4] = await conn.execute('SELECT id FROM employee WHERE first_name = "' + fname + '" AND last_name = "' + lname + '"');
        mgrId = manager[0].id;

        const [results, fields5] = await conn.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + res.firstName + '","' + res.lastName + '","' + roleId + '","' + mgrId + '")');
      } else {
        const [results, fields5] = await conn.execute('INSERT INTO employee (first_name, last_name, role_id) VALUES ("' + res.firstName + '","' + res.lastName + '","' + roleId + '")');
      }

      this.viewAllEmployees();
    }

    async addDepartment() {
      const res = await inquirer.prompt({
        type: 'text',
        name: 'deptName',
        message: 'What is the name of the new department?'
      });

      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [results, fields] = await conn.execute('INSERT INTO department (name) VALUES ("' + res.deptName + '")');
      
      this.viewAllDepartments();
    }


    async addRole() {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [results, fields] = await conn.execute('SELECT name FROM department');

      const res = await inquirer
      .prompt([
        {
          type: 'text',
          name: 'roleTitle',
          message: 'What is the title of the new role?'
        },
        {
          type: 'text',
          name: 'roleSalary',
          message: 'What is the salary of the role?'
        },
        {
          type: 'list',
          name: 'roleDept',
          message: 'Which department does this role belong to?',
          choices: results
        }
      ]);

      const [results2, fields2] = await conn.execute('SELECT id FROM department WHERE name = "' + res.roleDept + '"');
      const deptId = results2[0].id;

      const sql = 'INSERT INTO role (title, salary, department_id) VALUES ("' + res.roleTitle + '",' + res.roleSalary + ',' + deptId + ')';

      const [results3, fields3] = await conn.execute(sql);

      this.viewAllRoles();
    }

    async viewAllDepartments() {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [results, fields] = await conn.execute('SELECT * FROM department');
      
      console.log("");
      console.log("ID  Department Name");
      console.log("--  --------------------");
      for (var i = 0; i < results.length; i++) {
        const strid = results[i].id + "";
        console.log(format.addWhiteSpace(strid, 2) + format.addWhiteSpace(results[i].name, 20));
      }
      console.log();
      this.run();
    }

    async viewAllRoles() {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [results, fields] = await conn.execute('SELECT r.id, r.title, r.salary, d.name FROM role r JOIN department d ON r.department_id = d.id');

      console.log("");
      console.log("ID  Title                      Department            Salary");
      console.log("--  -------------------------  --------------------  ----------");

      for (var i = 0; i < results.length; i++) {
        const strid = results[i].id + "";
        console.log(format.addWhiteSpace(strid, 2) + format.addWhiteSpace(results[i].title, 25) + format.addWhiteSpace(results[i].name, 20) + format.addWhiteSpace(results[i].salary, 10));

      }
      console.log("");
      this.run(); 
    }

    async viewAllEmployees() {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'management_db'
      });

      const [result, fields] = await conn.execute('SELECT e.id, e.first_name, e.last_name, e.manager_id, r.title, r.salary, r.department_id, d.name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id');

      console.log("");
      console.log("ID  First Name       Last Name        Title                 Department            Salary      Manager");
      console.log("--  ---------------  ---------------  --------------------  --------------------  ----------  --------------------");

      for (var i = 0; i < result.length; i++) {
        const mgr_id = result[i].manager_id;

        var mgrName = "";
        for (var j = 0; j < result.length; j++) {
          if (result[i].manager_id === result[j].id) {
            mgrName = result[j].first_name + " " + result[j].last_name;
          }
        }

        const strid = result[i].id + "";
        console.log(format.addWhiteSpace(strid, 2) + format.addWhiteSpace(result[i].first_name, 15) + format.addWhiteSpace(result[i].last_name, 15) + format.addWhiteSpace(result[i].title, 20) + format.addWhiteSpace(result[i].name, 20) + format.addWhiteSpace(result[i].salary, 10) + mgrName);
      } 
      console.log("");
      this.run();
    }

}
    
module.exports = CLI;
