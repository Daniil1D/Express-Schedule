const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LessonTimeController = {
 createLessonTimes: async (req, res) => {
    try {
      // Данные о времени начала и окончания уроков
      const lessonTimes = [
        { lessonNumber: 1, startTime: "09:00:00", endTime: "09:45:00" },
        { lessonNumber: 2, startTime: "10:00:00", endTime: "10:45:00" },
        { lessonNumber: 3, startTime: "11:00:00", endTime: "11:45:00" },
        { lessonNumber: 4, startTime: "12:00:00", endTime: "12:45:00" },
        { lessonNumber: 5, startTime: "13:00:00", endTime: "13:45:00" },
        { lessonNumber: 6, startTime: "14:00:00", endTime: "14:45:00" },
        { lessonNumber: 7, startTime: "15:00:00", endTime: "15:45:00" }
      ];

      // Преобразуем формат времени к ISO-8601 и создаем время уроков в базе данных
      const createdLessonTimes = await Promise.all(lessonTimes.map(time => {
        // Создаем Date объекты для startTime и endTime
        const startTime = new Date(`1970-01-01T${time.startTime}`);
        const endTime = new Date(`1970-01-01T${time.endTime}`);

        return prisma.lessonTime.create({
          data: {
            lessonNumber: time.lessonNumber,
            startTime: startTime,
            endTime: endTime
          }
        });
      }));

      res.json({ message: 'Lesson times created successfully', lessonTimes: createdLessonTimes });
    } catch (error) {
      console.error('Error creating lesson times', error);
      res.status(500).json({ error: 'Internal server error' });
    }
 }
};

module.exports = LessonTimeController;
