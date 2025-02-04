-- concerns for office hours/tutoring:
-- making sure everything is referenced on the right files
-- correct/necessary dependencies in package.json files
-- errors on index file
-- issues running schema file?
-- am i on the right track with the type of code i'm using?
-- hint on how to complete bonus ?


DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(3) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id)
        REFERENCES roles(id)
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
);


