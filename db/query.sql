-- for copy & paste references

-- SQL query to get all salaries for a dept. 
-- TODO: figure out how to make department_id a variable
SELECT d.dept_name AS department_name, SUM(r.salary) AS dept_salary
        FROM roles r
        JOIN department d ON r.department_id = d.id
        WHERE r.department_id = $1
        GROUP BY d.dept_name


-- SQL query to show all employees in a department
-- TODO: figure out how to select individual departments
SELECT CONCAT (e.first_name, ' ', e.last_name) AS employee_name, 
    d.dept_name AS department_name 
        FROM employee e 
            JOIN roles r 
                ON e.role_id = r.id 
                    JOIN department d 
                        ON r.department_id = d.id 
                            ORDER BY d.dept_name, e.last_name
                                WHERE d.id = $1;

-- query for viewEmployees()
SELECT 
    employee.id,
    CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name,
    roles.salary,
    department.name AS department_name,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM 
     employee
LEFT JOIN 
    roles ON employee.role_id = roles.id
LEFT JOIN 
    department ON roles.department_id = department.id
LEFT JOIN 
     employee AS manager ON employee.manager_id = manager.id

-- query for viewRoles()
SELECT
     roles.id,
     roles.title,
     roles.salary,
     department.dept_name AS department_name
FROM
     roles
LEFT JOIN
     department 
        ON roles.department_id = department.id