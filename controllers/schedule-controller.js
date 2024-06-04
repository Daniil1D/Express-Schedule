const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ScheduleController = {
  createSchedule: async (req, res) => {
      const { classId, date, teacherId, lessonTimeId, subjectId } = req.body;
    
      const createdById = req.user.userId;
    
      // Проверяем, что все поля заполнены
      if (!classId || !date || !teacherId || !lessonTimeId || !subjectId || !createdById) {
        return res.status(400).json({ error: 'All fields are required' });
      }
    
      try {
        const schedule = await prisma.schedule.create({
          data: {
            classId: parseInt(classId),
            date,
            teacherId: parseInt(teacherId),
            lessonTimeId: parseInt(lessonTimeId),
            subjectId: parseInt(subjectId),
            createdById: parseInt(createdById),
          },
        });
    
        res.json(schedule);
      } catch (error) {
        console.error("Error in createSchedule:", error);
        res.status(500).json({ error: 'There was an error creating the schedule' });
      }
  },
  
    getAllSchedules: async (req, res) => {
      try {
        const allSchedules = await prisma.schedule.findMany({
          include: {
            teacher: true,
            class: true,
            lessonTime: true,
            subject: true,
            comments: true,
          },
        });
  
        res.json(allSchedules);
      } catch (error) {
        console.error('Ошибка при получении расписаний:', error);
        return res.status(500).json({ error: 'Ошибка при получении расписаний' });
      }
    },
    editSchedule: async (req, res) => {
      const { scheduleId } = req.params;
      const { classId, date, teacherId, lessonTimeId, subjectId } = req.body;
  
      try {
        const updatedSchedule = await prisma.schedule.update({
          where: { id: parseInt(scheduleId) },
          data: {
            classId: parseInt(classId),
            date,
            teacherId: parseInt(teacherId),
            lessonTimeId: parseInt(lessonTimeId),
            subjectId: parseInt(subjectId),
          },
        });
  
        res.json(updatedSchedule);
      } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Error updating schedule' });
      }
    },
    getScheduleByClassId: async (req, res) => {
      const { classId } = req.params;
  
      try {
        const schedules = await prisma.schedule.findMany({
          where: {
            classId: parseInt(classId),
          },
          include: {
            teacher: true,
            class: true,
            lessonTime: true,
            subject: true,
            comments: true,
          },
        });
  
        res.json(schedules);
      } catch (error) {
        console.error('Error fetching schedules by class:', error);
        res.status(500).json({ error: 'Error fetching schedules by class' });
      }
    },
    getScheduleById: async (req, res) => {
      const { scheduleId } = req.params;
  
      try {
          const schedule = await prisma.schedule.findUnique({
              where: {
                  id: parseInt(scheduleId),
              },
              include: {
                  teacher: true,
                  class: true,
                  lessonTime: true,
                  subject: true,
                  comments: true,
              },
          });
  
          if (!schedule) {
              return res.status(404).json({ error: "Расписание не найдено" });
          }
  
          res.json(schedule);
      } catch (error) {
          console.error('Ошибка при получении расписания по id:', error);
          res.status(500).json({ error: 'Ошибка при получении расписания по id' });
      }
  },
    deleteSchedule: async (req, res) => {
      // Логирование req.user перед проверкой роли
      console.log('req.user:', req.user);
  
      const { scheduleId } = req.params;
  
      try {
          // Убедитесь, что req.user определен
          if (!req.user) {
              return res.status(401).json({ error: "Не авторизован" });
          }
  
          // Проверяем, определена ли роль пользователя в объекте req.user
          if (!req.user.role) {
              console.log('Роль пользователя не определена');
              return res.status(403).json({ error: "Доступ запрещен. Роль пользователя не определена." });
          }
  
          // Проверяем, имеет ли пользователь роль "Заместитель Директора"
          if (req.user.role.name !== 'Заместитель Директора') {
              console.log('Проверка роли:', req.user.role.name); // Логирование роли пользователя
              return res.status(403).json({ error: "Доступ запрещен. Только заместители директора могут удалять расписания." });
          }
  
          // Убеждаемся, что расписание существует
          const schedule = await prisma.schedule.findUnique({ where: { id: parseInt(scheduleId) } });
          if (!schedule) {
              return res.status(404).json({ error: "Расписание не найдено" });
          }
  
          // Удаляем все связанные комментарии, а затем удаляем расписание
          const transaction = await prisma.$transaction([
              prisma.comment.deleteMany({ where: { scheduleId: parseInt(scheduleId) } }),
              prisma.schedule.delete({ where: { id: parseInt(scheduleId) } }),
          ]);
  
         res.status(200).json({ message: 'Расписание успешно удалено' });
        } catch (error) {
          console.error('Ошибка при удалении расписания:', error);
          res.status(500).json({ error: 'Что-то пошло не так при удалении расписания' });
        }
      }
};


module.exports = ScheduleController;
