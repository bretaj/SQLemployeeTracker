import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.ts';

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
        pool.query (query, values)
            .then((result) => {
                console.log(`department '${result.rows[0].name}' added successfully`);
            })
            .catch((error) => {
                console.error('error adding department:', error);
            });
    });
}