const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LessonTimeController = {
  createLessonTimes: async (req, res) => {
    try {
      const { lessonTimes } = req.body;

      // Преобразуем формат времени к ISO-8601 и создаем время уроков в базе данных
      const createdLessonTimes = await Promise.all(lessonTimes.map(async time => {
        // Создаем время уроков в базе данных
        return await prisma.lessonTime.create({
          data: {
            lessonNumber: time.lessonNumber,
            startTime: time.startTime,
            endTime: time.endTime
          }
        });
      }));

      res.json({ message: 'Lesson times created successfully', lessonTimes: createdLessonTimes });
    } catch (error) {
      console.error('Error creating lesson times', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllLessonTime: async (req, res) => {
    try {
      const lessonTimes = await prisma.lessonTime.findMany(); // Запрос для получения всех времен уроков

      res.json(lessonTimes);
    } catch (error) {
      console.error('Error fetching lesson times', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = LessonTimeController;
