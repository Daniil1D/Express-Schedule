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
    
};


module.exports = ScheduleController;
