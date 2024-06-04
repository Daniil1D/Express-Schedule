const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TeacherController = {
  createTeacher: async (req, res) => {
    try {
      const { fullName, subjects } = req.body;

      const createdTeacher = await prisma.teacher.create({
        data: {
          fullName
          
        },
        include: {
          subjects: true 
        }
      });

      res.json({ message: 'Teacher created successfully', teacher: createdTeacher });
    } catch (error) {
      console.error('Error creating teacher:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllTeachers: async (req, res) => {
    try {
      const teachers = await prisma.teacher.findMany({
        include: {
          subjects: true,
          schedules: true
        }
      });

      res.json(teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = TeacherController;
