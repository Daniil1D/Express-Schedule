const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ClassController = {
  createClasses: async (req, res) => {
    try {
      // Данные о классах для заполнения
      const classes = [
        '1а', '1б', '1в',
        '2а', '2б', '2в',
        '3а', '3б', '3в',
        '4а', '4б', '4в',
        '5а', '5б', '5в',
        '6а', '6б', '6в',
        '7а', '7б', '7в',
        '8а', '8б', '8в',
        '9а', '9б', '9в',
        '10а', '10б', '10в',
        '11а', '11б', '11в'
      ];

      // Создаем или обновляем классы в базе данных
      const createdClasses = [];
      for (const className of classes) {
        const existingClass = await prisma.class.findFirst({
          where: {
            name: className
          }
        });
        if (existingClass) {
          createdClasses.push(existingClass);
        } else {
          const newClass = await prisma.class.create({ data: { name: className } });
          createdClasses.push(newClass);
        }
      }

      res.json({ message: 'Classes created successfully', classes: createdClasses });
    } catch (error) {
      console.error('Error creating classes', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = ClassController;
