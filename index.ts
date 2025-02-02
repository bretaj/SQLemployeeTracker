import inquirer from 'inquirer';
import fs from 'fs';
import { Client } from 'pg';

// todo: add inquirer.prompt code somewhere in this area????

function mainMenu(): void {
    const questions: QuestionCollection = [
        {
            type: 'list',
            name: 'action',
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
    ]
};    

function addDepartment(): void {
    const questions: QuestionCollection = [
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        }
    ];
    // todo: code to add new dept to db
}

function addRole(): void {
    const questions: QuestionCollection = [
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the title of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary for this role?',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'What is the department ID for this role?',
        }
    ];
        // todo: code to add new role to db
}

function addEmployee(): void {
    const questions: QuestionCollection = [
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the mployee?',
        },
        {
            type: 'input',
            mame: 'roleID',
            message: 'What is the role ID for this employee?',
        },
        {
            type: 'input',
            name: 'managerID',
            message: 'What is the manager ID for this employee (leae blank if none)?',
            default: null
        }
    ];
    // todo: code to add new employee to db
}

function updateEmployee(): void {
    const questions: QuestionCollection = [
        {
            type: '',
            name: '',
            message: '',
        }
    ]
}