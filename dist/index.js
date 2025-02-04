import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
await connectToDb();
const questions = [
    {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'View department salaries',
            'View all employees in a department',
            'Delete role',
            'Delete employee',
            'Delete department',
            'Exit'
        ]
    }
];
function mainmenu() {
    inquirer.prompt(questions).then((response) => {
        switch (response.choices) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'View department salaries':
                viewDeptSalaries();
                break;
            case 'View employees in a department':
                viewEmployeesByDept();
                break;
            case 'Delete employee':
                deleteEemployee();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete department':
                deleteDepartment();
                break;
            case 'Exit':
                pool.end();
                process.exit();
                break;
        }
    });
}
// code to view depts, roles, employees
async function viewDepartments() {
    try {
        const res = await pool.query('SELECT * FROM department');
        // res.rows.forEach((department) => {
        //     console.table(department);
        // });
        console.table(res.rows);
        mainmenu();
    }
    catch (err) {
        console.error('error retrieving departments:', err);
    }
}
async function viewRoles() {
    try {
        const res = await pool.query(`
            SELECT
                roles.id,
                roles.title,
                roles.salary,
                department.dept_name AS department_name
            FROM
                roles
            LEFT JOIN
                department ON roles.department_id = department.id
            `);
        // res.rows.forEach((roles) => {
        //     console.table(roles);
        // });
        console.table(res.rows);
        mainmenu();
    }
    catch (err) {
        console.error('error retrieving roles:', err);
    }
}
// rewrite query to make displayed table neater?
async function viewEmployees() {
    try {
        const res = await pool.query(`
            SELECT 
                employee.id,
                CONCAT (employee.first_name, ' ', employee.last_name) AS employee_name,
                roles.title AS role,
                roles.salary,
                department.dept_name AS department_name,
                CONCAT (manager.first_name, ' ', manager.last_name) AS manager_name
            FROM 
                employee
            LEFT JOIN 
                roles ON employee.role_id = roles.id
            LEFT JOIN 
                department ON roles.department_id = department.id
            LEFT JOIN 
                employee AS manager ON employee.manager_id = manager.id
        `);
        // res.rows.forEach((employee) => {
        //     console.log(employee);
        // });
        console.table(res.rows);
        mainmenu();
    }
    catch (err) {
        console.error('error retrieving employees:', err);
    }
}
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept_name',
            message: 'what is the name of the new department?',
        }
    ])
        .then((answers) => {
        const { dept_name } = answers;
        const query = 'INSERT INTO department (dept_name) VALUES ($1) RETURNING *';
        const values = [dept_name];
        pool.query(query, values)
            .then((_result) => {
            console.log(`department '${dept_name}' added successfully`);
            mainmenu();
        })
            .catch((error) => {
            console.error('error adding department:', error);
            mainmenu();
        });
    });
}
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'enter the title of the new role',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'enter the salary for the role',
            validate: input => {
                const number = parseFloat(input);
                return !isNaN(number) && number > 0 ? true : 'please enter a valid salary';
            }
        },
        {
            type: 'input',
            name: 'department',
            message: 'enter the department for this role',
        }
    ])
        .then((answers) => {
        const { title, salary, department } = answers;
        //uses subquery to look for dept_id based on dept_name. not sure if this is the right way
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE dept_name = $3)) RETURNING *';
        const values = [title, salary, department];
        pool.query(query, values)
            .then((result) => {
            console.log(`role '${result.rows[0].title}' added successfully`);
            mainmenu();
        })
            .catch((error) => {
            console.error('error adding role:', error);
            mainmenu();
        });
    });
}
// TODO: for new employee, add: first name, last name, role, and manager
function addEmployee() {
    // grabs roles & managers so user can choose which role & manager a new employee has
    // TODO: figure out how to select managers only instead of all employees. Will likely need to adjust schema & seed files
    Promise.all([
        pool.query('SELECT id, title FROM roles'),
        pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee')
    ])
        .then(([rolesResult, managersResult]) => {
        const roles = rolesResult.rows;
        const managers = managersResult.rows;
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
        const managerChoices = managers.map(manager => ({ name: manager.name, value: manager.id }));
        return inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the new employee',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the new employee',
            },
            {
                type: 'list',
                name: 'role',
                message: 'Select the role for the new employee',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Select the manager for the new employee',
                choices: managerChoices
            }
        ]);
    })
        .then((answers) => {
        const { first_name, last_name, role, manager } = answers;
        const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *, (SELECT title FROM roles WHERE id = $3) AS role_title `;
        const values = [first_name, last_name, role, manager];
        return pool.query(query, values);
    })
        .then((result) => {
        console.log(`Employee '${result.rows[0].first_name} ${result.rows[0].last_name}' added successfully with role '${result.rows[0].role_title}'`);
        mainmenu();
    })
        .catch((error) => {
        console.error('Error adding employee:', error);
        mainmenu();
    });
}
async function updateEmployeeRole() {
    const employeeData = await pool.query('SELECT * FROM employee');
    let employeeList = employeeData.rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { employee_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'choose an employee to update',
            choices: employeeList
        }
    ]);
    // .then((res) => {
    //     console.log(res)
    // })
    const roleData = await pool.query('SELECT * FROM roles');
    let roleList = roleData.rows.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    const { new_role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'new_role_id',
            message: 'choose a new role for the employee',
            choices: roleList
        }
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id]);
    console.log(`updated employee's role successfully`);
    mainmenu();
}
//TODO: add bonus questions. See query.sql file for potential usable queries
// function to view all salaries within a selected department
async function viewDeptSalaries() {
    const departmentData = await pool.query('SELECT * FROM department');
    let departmentList = departmentData.rows.map(({ id, dept_name }) => ({
        name: dept_name,
        value: id
    }));
    const { department_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'choose a department to view total salary',
            choices: departmentList
        }
    ]);
    const salaryData = await pool.query(`
        SELECT d.dept_name AS department_name, SUM(r.salary) AS dept_salary
        FROM roles r
        JOIN department d ON r.department_id = d.id
        WHERE r.department_id = $1
        GROUP BY d.dept_name`, [department_id]);
    const totalSalary = salaryData.rows[0].dept_salary || 0;
    const departmentName = salaryData.rows[0]?.department_name || 'unknown department';
    console.log(`the total salary for ${departmentName} is: $${totalSalary}`);
    mainmenu();
}
// function to show employees in a selected department
// TODO: figure out why list of departments is not showing up
async function viewEmployeesByDept() {
    const departmentData = await pool.query('SELECT * FROM department');
    let departmentList = departmentData.rows.map(({ id, dept_name }) => ({
        name: dept_name,
        value: id
    }));
    const { department_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'Choose a department to view its employees',
            choices: departmentList
        }
    ]);
    const employeeData = await pool.query(`
        SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee_name, 
        d.dept_name AS department_name 
        FROM employee e 
        JOIN roles r ON e.role_id = r.id 
        JOIN department d ON r.department_id = d.id 
        WHERE d.id = $1
        ORDER BY d.dept_name, e.last_name;`, [department_id]);
    if (employeeData.rows.length === 0) {
        console.log('There are no employees in this department.');
    }
    else {
        console.log(`Employees in the selected department:`);
        employeeData.rows.forEach(({ employee_name }) => {
            console.log(employee_name);
        });
    }
    mainmenu();
}
// function to delete role, department, employee
async function deleteRole() {
    const roleData = await pool.query('SELECT * FROM roles');
    const roleList = roleData.rows.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    const { role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'role_id',
            message: 'choose a role to delete',
            choices: roleList
        }
    ]);
    await pool.query('DELETE FROM roles WHERE id = $1', [role_id]);
    console.log('role deleted successfully');
    mainmenu();
}
// function to delete department
async function deleteDepartment() {
    const departmentData = await pool.query('SELECT * FROM department');
    const departmentList = departmentData.rows.map(({ id, dept_name }) => ({
        name: dept_name,
        value: id
    }));
    const { department_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'choose a department to delete',
            choices: departmentList
        }
    ]);
    await pool.query('DELETE FROM department WHERE id = $1', [department_id]);
    console.log('department deleted successfully');
    mainmenu();
}
// function to delete employee
async function deleteEemployee() {
    const employeeData = await pool.query('SELECT * FROM employee');
    const employeeList = employeeData.rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { employee_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'choose a department to delete',
            choices: employeeList
        }
    ]);
    await pool.query('DELETE FROM employee WHERE id = $1', [employee_id]);
    console.log('employee deleted successfully');
    mainmenu();
}
mainmenu();
