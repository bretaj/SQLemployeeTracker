INSERT INTO department (id, dept_name)
    VALUES 
    (1, 'Sales'),
    (2, 'Marketing'),
    (3, 'Customer Support'),
    (4, 'Human Resources'),
    (5, 'Legal'),
    (6, 'IT');

INSERT INTO roles (id, title, salary, department_id)
    VALUES
    (1, 'sales rep', 75000, 1),
    (2, 'sales lead', 90000, 1),
    (3, 'designer', 65000, 2),
    (4, 'marketing lead', 75000, 2),
    (5, 'support rep', 60000, 3),
    (6, 'Support Lead', 65000, 3),
    (7, 'HR Generalist', 75000, 4),
    (8, 'HR Lead', 80000, 4),
    (9, 'Lawyer', 100000, 5),
    (10, 'IT Specialist', 105000, 6),
    (11, 'IT Lead', 115000, 6);

    