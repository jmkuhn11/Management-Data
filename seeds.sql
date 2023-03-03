INSERT INTO department (name)
VALUES ("Sales"),
       ("Customer Service"),
       ("Tech"),
       ("Human Resources"),
       ("Finance");
       
INSERT INTO role (title, salary, department_id)
VALUES ("Director of Sales", 150000, 1),
       ("Sales Associate", 80000, 1),
       ("Phone Operator", 50000, 2),
       ("Help Desk", 50000, 2),
       ("Tech Services", 100000, 3),
       ("Software Developer", 130000, 3),
       ("Recruiter", 80000, 4),
       ("Assistant", 40000, 4),
       ("HR Analyst", 90000, 4),
       ("Financial Consultant", 110000, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Josh", "Kuhn", 1);

UPDATE employee SET manager_id = 6 WHERE id = 6;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lady", "Gaga", 7, 6),
       ("Trixie", "Mattel", 2, 6),
       ("Viola", "Davis", 4, 6),
       ("Barack", "Obama", 10, 6),
       ("Velma", "Dinkley", 6, 6);