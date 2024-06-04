const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ClassController = {
  createClasses: async (req, res) => {
    try {
      const { name } = req.body;

      // Создание нового класса в базе данных
      const createdClass = await prisma.class.create({
        data: {
          name,
        }
      });

      res.json({ message: 'Class created successfully', class: createdClass });
    } catch (error) {
      console.error('Error creating class', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await prisma.class.findMany(); // Запрос для получения всех классов

      res.json(classes);
    } catch (error) {
      console.error('Error fetching classes', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = ClassController;