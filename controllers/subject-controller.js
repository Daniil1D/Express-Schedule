const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SubjectController = {
  createSubjects: async (req, res) => {
    try {
      const { subjects } = req.body;
  
      if (!subjects || !Array.isArray(subjects)) { 
        return res.status(400).json({ error: 'Subjects array is required' });
      }
  
      const createdSubjects = await prisma.subject.createMany({ data: subjects });
  
      res.json({ message: 'Subjects created successfully', subjects: createdSubjects });
    } catch (error) {
      console.error('Error creating subjects', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getAllSubjects: async (req, res) => {
    try {
      const subjects = await prisma.subject.findMany();

      res.json({ message: 'Subjects fetched successfully', subjects: subjects });
    } catch (error) {
      console.error('Error fetching subjects', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = SubjectController;
