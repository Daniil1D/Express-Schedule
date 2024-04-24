const express = require("express");
const router = express.Router();
const multer = require('multer');
const UserController = require("../controllers/user-controller");
const RoleController = require("../controllers/role-controller");
const ClassController = require("../controllers/class-controller");
const PostController = require("../controllers/post-controller");
const ScheduleController = require("../controllers/schedule-controller");
const SubjectController = require("../controllers/subject-controller");
const LessonTimeController = require('../controllers/lessontime-controller');
const CommentController = require("../controllers/comment-controller");
const { authenticateToken } = require("../middleware/auth");


const uploadDestination = 'uploads';

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Роуты User
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put("/users/:id", authenticateToken, upload.single('avatar'), UserController.updateUser);

// Роуты Role
router.post("/roles", RoleController.createRole);

//Class
router.post('/classes', ClassController.createClasses);

// Роуты Post
router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// POST запрос для создания расписания
router.post('/schedules', authenticateToken, ScheduleController.createSchedule);
router.get('/schedules',authenticateToken, ScheduleController.getAllSchedules);
router.get('/schedules/class/:classId', authenticateToken, ScheduleController.getScheduleByClassId);

// Маршрут для создания нового предмета
router.post('/subjects', SubjectController.createSubjects);

// Route for populating lesson times
router.post('/lessontimes', LessonTimeController.createLessonTimes);

// Роуты комментариев
router.post("/comments", authenticateToken, CommentController.createComment);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);


module.exports = router;
