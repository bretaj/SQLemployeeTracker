import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.ts';

await connectToDb();

const questions: any[] = [
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
            'Exit'
        ]
    }
];

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
        case 'Exit':
            pool.end();
            break;
    }
});

// code to view depts, roles, employees
// should i re-write query so only id, and name of department is visible?
async function viewDepartments(): void {
    try {
        const res = await pool.query('SELECT * FROM departments');
        res.rows.forEach((department) => {
            console.log(department);
        });
    } catch (err) {
        console.error('error retrieving departments:', err);
    }
}
async function viewRoles(): void {
    try {
        const res = await pool.query('SELECT * FROM roles');
        res.rows.forEach((roles) => {
            console.log(roles);
        });
    } catch (err) {
        console.error('error retrieving roles:', err);
    }
}
// rewrite query to make displayed table neater?
async function viewEmployees(): void {
    try {
        const res = await pool.query('SELECT * FROM employee');
        res.rows.forEach((employee) => {
            console.log(employee);
        });
    } catch (err) {
        console.error('error retrieving employees:', err);
    }
}

// adding functions to update db
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
            const query = 'INSERT INTO department (name) VALUES ($1) RETURNING *';
            const values = [dept_name];
            pool.query(query, values)
                .then((result) => {
                    console.log(`department '${result.rows[0].name}' added successfully`);
                })
                .catch((error) => {
                    console.error('error adding department:', error);
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
        const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3)) RETURNING *';
        const values = [title, salary, department];

        pool.query(query, values)
            .then((result) => {
                console.log(`role '${result.rows[0].title}' added successfully`);
            })
            .catch((error) => {
                console.error('error adding role:', error);
            });
    });
}

// for new employee, add: first name, last name, role, and manager