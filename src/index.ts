import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';

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
        // case 'Add an employee':
        //     addEmployee();
        //     break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Exit':
            pool.end();
            process.exit();
            break;
    }
});
}
// code to view depts, roles, employees
// TODO: re-write query so only id, and name of department is visible?
async function viewDepartments(): Promise<void> {
    try {
        const res = await pool.query('SELECT * FROM department');
        // res.rows.forEach((department) => {
        //     console.table(department);
        // });
        console.table(res.rows)
        mainmenu();
    } catch (err) {
        console.error('error retrieving departments:', err);
    }
}
async function viewRoles(): Promise<void> {
    try {
        const res = await pool.query('SELECT * FROM roles');
        // res.rows.forEach((roles) => {
        //     console.table(roles);
        // });
        console.table(res.rows)
        mainmenu();
    } catch (err) {
        console.error('error retrieving roles:', err);
    }
}
// rewrite query to make displayed table neater?
async function viewEmployees(): Promise<void> {
    try {
        const res = await pool.query('SELECT * FROM employee');
        // res.rows.forEach((employee) => {
        //     console.log(employee);
        // });
        console.table(res.rows)
        mainmenu();
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
        const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3)) RETURNING *';
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

async function updateEmployeeRole(){
    const employeeData = await pool.query('SELECT * FROM employee');
    let employeeList = employeeData.rows.map(({id, first_name, last_name}) =>({
        name:`${first_name} ${last_name}`,
        value: id
    })); 
    const { employee_id } = await inquirer.prompt ([
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
    // TODO: finish code for role ... can use this as a template
    // TODO: figure out why employee list and roles list are appearing at same time, making an employee unable to be selected
    const roleData = await pool.query('SELECT * FROM roles');
    let roleList = roleData.rows.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    const { new_role_id } = await inquirer.prompt ([
        {
            type: 'list',
            name: 'new_role_id',
            message: 'choose a new role for the employee',
            choices: roleList
        }
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id]);
    console.log(`updated employee's role successfully`);
    mainmenu()
}



// TODO: add return to main menu function
mainmenu()