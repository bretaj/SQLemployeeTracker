import inquirer from 'inquirer';
import fs from 'fs';
import { Client } from 'pg';

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
    ];
