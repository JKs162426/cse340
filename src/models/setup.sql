CREATE TABLE organization (
    organization_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    contact_email VARCHAR(100),
    logo_filename VARCHAR(100)
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE projects (
    project_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    project_location VARCHAR(100),
    start_date DATE,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

INSERT INTO projects (organization_id, title, description, project_location, start_date)
VALUES
(1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful!', 'Local Park', '2026-03-25'),
(1, 'Neighborhood Garden Build', 'Help create a new community garden for local families.', 'Community Garden', '2026-04-01'),
(1, 'Playground Repair', 'Assist in repairing playground equipment for children.', 'City Playground', '2026-04-08'),
(1, 'Sidewalk Improvement', 'Support efforts to improve neighborhood sidewalks.', 'Downtown Area', '2026-04-15'),
(1, 'Community Bench Installation', 'Install benches in public recreation spaces.', 'Riverside Park', '2026-04-22'),

(2, 'Food Drive', 'Help collect and distribute food to those in need.', 'Community Center', '2026-03-26'),
(2, 'Urban Garden Workshop', 'Teach community members how to grow food in small spaces.', 'Greenhouse Center', '2026-04-02'),
(2, 'Neighborhood Compost Day', 'Promote composting through a hands-on workshop.', 'Local Farm', '2026-04-09'),
(2, 'Tree Planting Event', 'Plant trees to improve the neighborhood environment.', 'East Side Park', '2026-04-16'),
(2, 'Fresh Harvest Giveaway', 'Distribute fresh produce to local families.', 'Farmers Market', '2026-04-23'),

(3, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Library', '2026-03-27'),
(3, 'Senior Assistance Day', 'Help elderly residents with daily tasks and companionship.', 'Senior Center', '2026-04-03'),
(3, 'Charity Clothing Sort', 'Sort and organize donated clothing for families in need.', 'Charity Office', '2026-04-10'),
(3, 'Youth Mentorship Program', 'Mentor young people through service and leadership activities.', 'Youth Center', '2026-04-17'),
(3, 'Health Fair Support', 'Assist with a community health and wellness fair.', 'City Hall', '2026-04-24');

CREATE TABLE category (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(6, 4),
(7, 2),
(7, 1),
(8, 1),
(9, 1),
(10, 3),
(11, 2),
(11, 3),
(12, 3),
(13, 3),
(14, 2),
(15, 4);