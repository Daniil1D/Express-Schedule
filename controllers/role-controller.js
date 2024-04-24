const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RoleController = {
  createRole: async (req, res) => {
    try {
        // Данные о ролях для заполнения
        const roles = [
            { name: 'Ученик' },
            { name: 'Учитель' },
            { name: 'Заместитель Директора' },
            { name: 'Родитель' }
        ];

        // Создаем роли в базе данных
        const createdRoles = await Promise.all(roles.map(role => prisma.role.create({ data: role })));

        res.json({ message: 'Roles created successfully', roles: createdRoles });
    } catch (error) {
        console.error('Error creating roles', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
};
  
module.exports = RoleController;

