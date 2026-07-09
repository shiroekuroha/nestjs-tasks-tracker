INSERT INTO
    projects (name)
VALUES ('Obsidian'),
    ('Solar'),
    ('Lunar');

INSERT INTO
    task_groups (
        name,
        color,
        position,
        project_id
    )
VALUES ('Week 1', '#ffffffff', 0, 1),
    ('Week 2', '#ffffffff', 1, 1),
    ('Week 3', '#ffffffff', 2, 1);

INSERT INTO
    task_groups (
        name,
        color,
        position,
        project_id
    )
VALUES ('Week 1', '#ffffffff', 0, 2),
    ('Week 2', '#ffffffff', 1, 2),
    ('Week 3', '#ffffffff', 2, 2);

INSERT INTO
    task_groups (
        name,
        color,
        position,
        project_id
    )
VALUES ('Week 1', '#ffffffff', 0, 3),
    ('Week 2', '#ffffffff', 1, 3),
    ('Week 3', '#ffffffff', 2, 3);

INSERT INTO
    tasks (
        name,
        description,
        position,
        status,
        start_date,
        due_date,
        created_at,
        updated_at,
        task_group_id
    )
VALUES (
        'Make Coffee',
        'Just make some coffee, duh!',
        0,
        'TODO',
        NOW(),
        NULL,
        NOW(),
        NOW(),
        1
    ),
    (
        'Make Coffee',
        'Just make some coffee, duh!',
        0,
        'TODO',
        NOW(),
        NULL,
        NOW(),
        NOW(),
        2
    ),
    (
        'Make Coffee',
        'Just make some coffee, duh!',
        0,
        'TODO',
        NOW(),
        NULL,
        NOW(),
        NOW(),
        3
    );

INSERT INTO
    members (
        username,
        password,
        active,
        first_name,
        last_name,
        birthdate,
        email,
        phone,
        address
    )
VALUES (
        'dnguyen',
        'admin123',
        TRUE,
        'Duy',
        'Nguyen',
        to_date('08-01-2003', 'dd-mm-yyyy'),
        'dnguyen@gmail.com',
        NULL,
        NULL
    ),
    (
        'evostok',
        'user12345',
        FALSE,
        'Endra',
        'Vostok',
        to_date('04-10-2005', 'dd-mm-yyyy'),
        'evostok@gmail.com',
        NULL,
        NULL
    ),
    (
        'jdoe',
        'password123',
        TRUE,
        'John',
        'Doe',
        to_date('15-03-1995', 'dd-mm-yyyy'),
        'jdoe@gmail.com',
        '0901234567',
        '123 Main Street'
    ),
    (
        'asmith',
        'password456',
        TRUE,
        'Alice',
        'Smith',
        to_date('22-07-1998', 'dd-mm-yyyy'),
        'asmith@gmail.com',
        '0902345678',
        '456 Oak Avenue'
    ),
    (
        'bwilson',
        'password789',
        FALSE,
        'Bob',
        'Wilson',
        to_date('10-12-1990', 'dd-mm-yyyy'),
        'bwilson@gmail.com',
        '0903456789',
        '789 Pine Road'
    ),
    (
        'mlee',
        'secret123',
        TRUE,
        'Michael',
        'Lee',
        to_date('05-05-2001', 'dd-mm-yyyy'),
        'mlee@gmail.com',
        '0904567890',
        '12 Lake View'
    ),
    (
        'snguyen',
        'hello123',
        TRUE,
        'Sarah',
        'Nguyen',
        to_date('18-09-1997', 'dd-mm-yyyy'),
        'snguyen@gmail.com',
        '0905678901',
        '88 River Street'
    ),
    (
        'kpatel',
        'test12345',
        FALSE,
        'Kiran',
        'Patel',
        to_date('25-02-1993', 'dd-mm-yyyy'),
        'kpatel@gmail.com',
        NULL,
        '77 Hill Road'
    ),
    (
        'lgarcia',
        'pass1234',
        TRUE,
        'Luis',
        'Garcia',
        to_date('30-11-1999', 'dd-mm-yyyy'),
        'lgarcia@gmail.com',
        '0906789012',
        '45 Garden Lane'
    ),
    (
        'hkim',
        'kim123456',
        TRUE,
        'Hana',
        'Kim',
        to_date('12-06-2000', 'dd-mm-yyyy'),
        'hkim@gmail.com',
        '0907890123',
        '99 Sunset Blvd'
    ),
    (
        'alextran',
        'alex12345',
        TRUE,
        'Alex',
        'Tran',
        to_date('14-02-1996', 'dd-mm-yyyy'),
        'alex.tran@gmail.com',
        '0912345001',
        '12 Nguyen Trai Street'
    ),
    (
        'marypham',
        'marypass01',
        TRUE,
        'Mary',
        'Pham',
        to_date('21-08-1994', 'dd-mm-yyyy'),
        'mary.pham@gmail.com',
        '0912345002',
        '45 Le Loi Street'
    ),
    (
        'tuanle',
        'tuansecure',
        FALSE,
        'Tuan',
        'Le',
        to_date('03-11-1992', 'dd-mm-yyyy'),
        'tuan.le@gmail.com',
        '0912345003',
        '78 Tran Hung Dao'
    ),
    (
        'linhvu',
        'linhpassword',
        TRUE,
        'Linh',
        'Vu',
        to_date('19-04-2001', 'dd-mm-yyyy'),
        'linh.vu@gmail.com',
        '0912345004',
        '90 Hoang Dieu'
    ),
    (
        'danielpark',
        'daniel123',
        TRUE,
        'Daniel',
        'Park',
        to_date('28-09-1998', 'dd-mm-yyyy'),
        'daniel.park@gmail.com',
        '0912345005',
        '22 Maple Street'
    ),
    (
        'sophiawang',
        'sophia456',
        FALSE,
        'Sophia',
        'Wang',
        to_date('07-12-1995', 'dd-mm-yyyy'),
        'sophia.wang@gmail.com',
        '0912345006',
        '35 Cherry Avenue'
    ),
    (
        'minhhoang',
        'minhpass99',
        TRUE,
        'Minh',
        'Hoang',
        to_date('16-06-1999', 'dd-mm-yyyy'),
        'minh.hoang@gmail.com',
        '0912345007',
        '101 Phan Chu Trinh'
    ),
    (
        'jamesbrown',
        'james789',
        TRUE,
        'James',
        'Brown',
        to_date('25-01-1989', 'dd-mm-yyyy'),
        'james.brown@gmail.com',
        '0912345008',
        '56 Green Road'
    ),
    (
        'oliviadavis',
        'olivia321',
        FALSE,
        'Olivia',
        'Davis',
        to_date('11-10-1997', 'dd-mm-yyyy'),
        'olivia.davis@gmail.com',
        '0912345009',
        '67 Park Avenue'
    ),
    (
        'williamchen',
        'william555',
        TRUE,
        'William',
        'Chen',
        to_date('09-03-1991', 'dd-mm-yyyy'),
        'william.chen@gmail.com',
        '0912345010',
        '88 Lake Street'
    ),
    (
        'emmawilson',
        'emma888',
        TRUE,
        'Emma',
        'Wilson',
        to_date('23-07-2002', 'dd-mm-yyyy'),
        'emma.wilson@gmail.com',
        NULL,
        NULL
    ),
    (
        'noahsmith',
        'noah999',
        FALSE,
        'Noah',
        'Smith',
        to_date('30-05-1996', 'dd-mm-yyyy'),
        'noah.smith@gmail.com',
        NULL,
        NULL
    ),
    (
        'isabellamartin',
        'bella123',
        TRUE,
        'Isabella',
        'Martin',
        to_date('18-09-2000', 'dd-mm-yyyy'),
        'isabella.martin@gmail.com',
        '0912345013',
        '14 Rose Street'
    ),
    (
        'ethanjohnson',
        'ethan456',
        TRUE,
        'Ethan',
        'Johnson',
        to_date('06-02-1993', 'dd-mm-yyyy'),
        'ethan.johnson@gmail.com',
        '0912345014',
        '25 King Road'
    ),
    (
        'miaanderson',
        'mia789',
        FALSE,
        'Mia',
        'Anderson',
        to_date('17-12-1998', 'dd-mm-yyyy'),
        'mia.anderson@gmail.com',
        '0912345015',
        '39 Queen Street'
    ),
    (
        'lucasthomas',
        'lucas321',
        TRUE,
        'Lucas',
        'Thomas',
        to_date('04-08-1994', 'dd-mm-yyyy'),
        'lucas.thomas@gmail.com',
        '0912345016',
        '76 West Avenue'
    ),
    (
        'avajackson',
        'ava654',
        TRUE,
        'Ava',
        'Jackson',
        to_date('29-10-2001', 'dd-mm-yyyy'),
        'ava.jackson@gmail.com',
        NULL,
        '15 Oak Lane'
    ),
    (
        'benjaminwhite',
        'ben123',
        FALSE,
        'Benjamin',
        'White',
        to_date('13-01-1990', 'dd-mm-yyyy'),
        'benjamin.white@gmail.com',
        '0912345018',
        '44 Elm Street'
    ),
    (
        'charlotteharris',
        'charlotte1',
        TRUE,
        'Charlotte',
        'Harris',
        to_date('24-03-1997', 'dd-mm-yyyy'),
        'charlotte.harris@gmail.com',
        '0912345019',
        '91 Cedar Road'
    ),
    (
        'henryclark',
        'henry222',
        TRUE,
        'Henry',
        'Clark',
        to_date('15-11-1996', 'dd-mm-yyyy'),
        'henry.clark@gmail.com',
        '0912345020',
        '33 Birch Avenue'
    );

INSERT INTO
    roles (name)
VALUES ('Administrator'),
    ('Project Manager'),
    ('Team Member'),
    ('Viewer');

INSERT INTO
    permissions (name)
VALUES ('tasks:update'),
    ('tasks:create'),
    ('tasks:delete'),
    ('task-groups:update'),
    ('task-groups:create'),
    ('task-groups:delete'),
    ('projects:add_member'),
    ('projects:remove_member'),
    ('projects:change_role');

INSERT INTO
    role_permissions (role_id, permission_id)
VALUES (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8),
    (1, 9),
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    (2, 6),
    (3, 1),
    (3, 2),
    (3, 3);

INSERT INTO
    project_members (
        project_id,
        member_id,
        role_id
    )
VALUES (1, 1, 2),
    (1, 2, 2),
    (1, 3, 2);