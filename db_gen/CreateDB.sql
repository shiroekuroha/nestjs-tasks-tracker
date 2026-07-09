DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS task_groups CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS check_lists CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS task_members CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;

DROP TYPE IF EXISTS status_types;

CREATE TYPE status_types AS ENUM (
    'TODO',
    'DOING',
    'DONE'
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE task_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(9) NOT NULL,
    position INTEGER NOT NULL,

    project_id INTEGER NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    position INTEGER NOT NULL,
    status status_types NOT NULL,
    start_date TIMESTAMP,
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    task_group_id INTEGER NOT NULL
);

CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    data BYTEA NOT NULL,

    task_id INTEGER NOT NULL
);

CREATE TABLE check_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL,

    task_id INTEGER NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    birthdate DATE NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(15) DEFAULT NULL,
    address VARCHAR(100) DEFAULT NULL
);

CREATE TABLE project_members (
    project_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    role_id INTEGER,

    PRIMARY KEY(project_id, member_id),

    FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,
    
    FOREIGN KEY(member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE SET NULL
);

CREATE TABLE task_members (
    task_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,

    PRIMARY KEY(task_id, member_id),

    FOREIGN KEY(task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,
    
    FOREIGN KEY(member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE role_permissions (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,

    PRIMARY KEY(role_id, permission_id),

    FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    
    FOREIGN KEY(permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

ALTER TABLE task_groups
ADD CONSTRAINT task_groups_project_fk 
FOREIGN KEY(project_id) 
REFERENCES projects(id) 
ON DELETE CASCADE;

ALTER TABLE tasks
ADD CONSTRAINT tasks_task_groups_fk 
FOREIGN KEY(task_group_id) 
REFERENCES task_groups(id) 
ON DELETE CASCADE;

ALTER TABLE attachments
ADD CONSTRAINT attachments_tasks_fk 
FOREIGN KEY(task_id) 
REFERENCES tasks(id) 
ON DELETE CASCADE;

ALTER TABLE check_lists
ADD CONSTRAINT check_lists_tasks_fk 
FOREIGN KEY(task_id) 
REFERENCES tasks(id) 
ON DELETE CASCADE;

