const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RoleController = {
    createRole: async (req, res) => {
        const { name } = req.body;
    
        if (!name) {
          return res.status(400).json({ error: 'Name field is required' });
        }
     
        try {
          const role = await prisma.role.create({
            data: {
              name,
            },
          });
    
          res.json(role);
        } catch (error) {
          console.error("Error in createRole:", error);
          res.status(500).json({ error: 'There was an error creating the role' });
        }
      },
      getAllRoles: async (req, res) => {
        try {
          const roles = await prisma.role.findMany();
          res.json(roles);
        } catch (error) {
          console.error("Error in getAllRoles:", error);
          res.status(500).json({ error: 'There was an error fetching roles' });
        }
      },
      getRoleById: async (req, res) => {
    try {
      const { id } = req.params;
      const role = await prisma.role.findUnique({ where: { id: parseInt(id) } });
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json(role);
    } catch (error) {
      console.error("Error in getRoleById:", error);
      res.status(500).json({ error: 'There was an error fetching the role' });
    }
  }
};
  
module.exports = RoleController;

