const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SubjectController = {
  createSubjects: async (req, res) => {
    try {
      // Данные о предметах для заполнения
      const subjects = [
        { name: 'Математика' },
        { name: 'Русский язык' },
        { name: 'Литература' },
        { name: 'Иностранные языки' },
        { name: 'Физика' },
        { name: 'Химия' },
        { name: 'Биология' },
        { name: 'География' },
        { name: 'История' },
        { name: 'Обществознание' },
        { name: 'Информатика ' },
        { name: 'Физическая культура' },
        { name: 'Музыка' },
        { name: 'Технология ' },
        { name: 'Изобразительное искусство' },
      ];

      // Создаем предметы в базе данных
      const createdSubjects = await Promise.all(subjects.map(subject => prisma.subject.create({ data: subject })));

      res.json({ message: 'Subjects created successfully', subjects: createdSubjects });
    } catch (error) {
      console.error('Error creating subjects', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = SubjectController;
