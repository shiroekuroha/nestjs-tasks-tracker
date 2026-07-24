import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}

async function main() {
  const prisma: PrismaService = new PrismaService();

  const member_data = {
    data: [
      {
        username: 'dnguyen1',
        password: '!Admin123',
        firstName: 'Duy',
        lastName: 'Nguyen',
        birthdate: '2003-01-08T00:00:00Z',
        email: 'dnguyen@gmail.com',
        phone: null,
        address: null,
      },
      {
        username: 'test080103',
        password: '!Admin123',
        firstName: 'Mave',
        lastName: 'Rick',
        birthdate: '2005-02-09T00:00:00Z',
        email: 'dnguyen@gmail.com',
        phone: null,
        address: null,
      },
    ],
  };

  const project_data = {
    data: [
      { name: 'Hydrogen', ownerId: 1 },
      { name: 'Helium', ownerId: 1 },
      { name: 'Lithium', ownerId: 1 },
    ],
  };

  const taskGroup_data = {
    data: [
      {
        name: 'Week 1',
        color: '#ffffff',
        position: 1,
        projectId: 1,
      },
      {
        name: 'Week 2',
        color: '#ffffff',
        position: 2,
        projectId: 1,
      },
      {
        name: 'Week 3',
        color: '#ffffff',
        position: 3,
        projectId: 1,
      },
    ],
  };

  const task_data = {
    data: [
      {
        name: 'Make Coffee',
        description: 'Description',
        position: 1,
        status: 'TODO',
        startDate: null,
        dueDate: null,
        taskGroupId: 1,
      },
      {
        name: 'Make Pancake',
        description: 'Description',
        position: 2,
        status: 'TODO',
        startDate: null,
        dueDate: null,
        taskGroupId: 1,
      },
      {
        name: 'Turn on TV',
        description: 'Description',
        position: 3,
        status: 'TODO',
        startDate: null,
        dueDate: null,
        taskGroupId: 1,
      },
    ],
  };

  const role_data = {
    data: [
      {
        name: 'Administrator',
      },
      {
        name: 'Project Manager',
      },
      {
        name: 'Project Contributor',
      },
    ],
  };

  const permission_data = {
    data: [
      {
        name: 'projects:update',
      },
      {
        name: 'projects:delete',
      },
      {
        name: 'projects:member_management',
      },
      {
        name: 'taskGroups:update',
      },
      {
        name: 'taskGroups:create',
      },
      {
        name: 'taskGroups:delete',
      },
      {
        name: 'tasks:update',
      },
      {
        name: 'tasks:create',
      },
      {
        name: 'tasks:delete',
      },
    ],
  };

  const rolePermission_data = {
    data: [
      {
        roleId: 1,
        permissionId: 1,
      },
      {
        roleId: 1,
        permissionId: 2,
      },
      {
        roleId: 1,
        permissionId: 3,
      },
      {
        roleId: 1,
        permissionId: 4,
      },
      {
        roleId: 1,
        permissionId: 5,
      },
      {
        roleId: 1,
        permissionId: 6,
      },
      {
        roleId: 1,
        permissionId: 7,
      },
      {
        roleId: 1,
        permissionId: 8,
      },
      {
        roleId: 1,
        permissionId: 9,
      },
      {
        roleId: 2,
        permissionId: 4,
      },
      {
        roleId: 2,
        permissionId: 5,
      },
      {
        roleId: 2,
        permissionId: 6,
      },
      {
        roleId: 2,
        permissionId: 7,
      },
      {
        roleId: 2,
        permissionId: 8,
      },
      {
        roleId: 2,
        permissionId: 9,
      },
      {
        roleId: 3,
        permissionId: 7,
      },
      {
        roleId: 3,
        permissionId: 8,
      },
      {
        roleId: 3,
        permissionId: 9,
      },
    ],
  };

  const data = {
    data: [
      {
        projectId: 1,
        memberId: 1,
        roleId: 1,
      },
      {
        projectId: 2,
        memberId: 1,
        roleId: 1,
      },
      {
        projectId: 3,
        memberId: 1,
        roleId: 1,
      },
    ],
  };

  console.log('Database(Test) seeded!');

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
