INSERT INTO department (dept_name)
    VALUES 
    ('Sales'),
    ('Marketing'),
    ('Customer Support'),
    ('Human Resources'),
    ('Legal'),
    ('IT');

INSERT INTO roles (title, salary, department_id)
    VALUES
    ('sales rep', 75000, 1),
    ('sales lead', 90000, 1),
    ('marketing specialist', 65000, 2),
    ('marketing lead', 75000, 2),
    ('support rep', 60000, 3),
    ('support lead', 65000, 3),
    ('HR generalist', 75000, 4),
    ('HR lead', 80000, 4),
    ('lawyer', 100000, 5),
    ('IT specialist', 105000, 6),
    ('IT lead', 115000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
    ('Finn', 'Shulamith', 1, 2),
    ('Matteus', 'Eglitis', 1, NULL),
    ('Veda', 'Rasch', 3, 4),
    ('Anne', 'Podsednikova', 4, NULL),
    ('Bernard', 'Grozdana', 5, 6),
    ('Hilaria', 'Wolters', 6, NULL),
    ('Hafsat', 'Butler', 7, 8),
    ('Anouk', 'Castro', 8, NULL), 
    ('Charlene', 'Janssens', 9, NULL),
    ('Xochiquetzal', 'Abadzhiev', 10, 11),
    ('Sabah ad-Din', 'Traviss', 11, NULL);
    


    