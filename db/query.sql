-- for copy & paste references

-- SQL query to get all salarys for a dept. 
-- not sure how to make selection a variable
SELECT SUM(salary) AS dept_salary 
    FROM roles 
        WHERE department_id = 2;


-- SQL query to show all employees by a department
-- haven't figured out how to select each dept individually
SELECT CONCAT (e.first_name, ' ', e.last_name) AS employee_name, 
    d.dept_name AS department_name 
        FROM employee e 
            JOIN roles r 
                ON e.role_id = r.id 
                    JOIN department d 
                        ON r.department_id = d.id 
                            ORDER BY d.dept_name, e.last_name;


