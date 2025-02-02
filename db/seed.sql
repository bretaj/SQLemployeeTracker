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
    (3, 'marketing specialist', 65000, 2),
    (4, 'marketing lead', 75000, 2),
    (5, 'support rep', 60000, 3),
    (6, 'support Lead', 65000, 3),
    (7, 'HR Generalist', 75000, 4),
    (8, 'HR Lead', 80000, 4),
    (9, 'lawyer', 100000, 5),
    (10, 'IT Specialist', 105000, 6),
    (11, 'IT Lead', 115000, 6);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES
    (1, 'Finn', 'Shulamith', 1, 2),
    (2, 'Matteus', 'Eglitis', 1, NULL),
    (3, 'Veda', 'Rasch', 3, 4),
    (4, 'Anne', 'Podsednikova', 4, NULL),
    (5, 'Bernard', 'Grozdana', 5, 6),
    (6, 'Hilaria', 'Wolters', 6, NULL),
    (7, 'Hafsat', 'Butler', 7, 8),
    (8, 'Anouk', 'Castro', 8, NULL), 
    (9, 'Charlene', 'Janssens', 9, NULL),
    (10, 'Xochiquetzal', 'Abadzhiev', 10, 11),
    (11, 'Sabah ad-Din', 'Traviss', 11, NULL);
    


    