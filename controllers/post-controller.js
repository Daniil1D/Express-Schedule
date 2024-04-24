const { prisma } = require('../prisma/prisma-client');

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;
  
    const authorId = req.user.userId;
  
    if (!content) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId: parseInt(authorId), // Ensure authorId is properly parsed as Int
        },
      });
  
      res.json(post);
    } catch (error) {
      console.error("Error in createPost:", error);
      res.status(500).json({ error: 'There was an error creating the post' });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          comments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Произошла ошибка при получении постов' });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;

    try {
      const postId = parseInt(id); // Преобразуем id в тип Int

      const post = await prisma.post.findUnique({
        where: { id: postId }, // Используем преобразованный postId
        include: {
          comments: {
            include: {
              user: true,
            }
          },
          author: true
        },
      });

      if (!post) {
        return res.status(404).json({ error: 'Пост не найден' });
      }

      res.json(post);
    } catch (error) {
      console.error("Error in getPostById:", error);
      res.status(500).json({ error: 'Произошла ошибка при получении поста' });
    }
},
deletePost: async (req, res) => {
  const { id } = req.params;

  // Проверка, что пользователь удаляет свой пост
  const postId = parseInt(id); // Преобразуем id в тип Int
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    return res.status(404).json({ error: "Пост не найден" });
  }

  if (post.authorId !== req.user.userId) {
    return res.status(403).json({ error: "Нет доступа" });
  }

  try {
    const transaction = await prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: postId } }),
      prisma.post.delete({ where: { id: postId } }),
    ]);

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Что-то пошло не так" });
  }
}
};

module.exports = PostController;
