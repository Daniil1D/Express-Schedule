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
const TeacherController = require('../controllers/teacher-controller');
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
router.delete("/users/:id", authenticateToken, UserController.deleteUser);
router.get("/users", authenticateToken,  UserController.getAllUsers); // Новый маршрут для получения всех пользователей

// Роуты Role
router.post("/roles", RoleController.createRole);
router.get("/roles", RoleController.getAllRoles);
router.get("/roles/:id", RoleController.getRoleById);

// Маршрут для классов
router.post('/classes', ClassController.createClasses);
router.get('/classes', ClassController.getAllClasses);

// Роуты Post
router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// POST запрос для создания расписания
router.post('/schedules', authenticateToken, ScheduleController.createSchedule);
router.get('/schedules', authenticateToken, ScheduleController.getAllSchedules);
router.get('/schedules/class/:classId', authenticateToken, ScheduleController.getScheduleByClassId);
router.patch('/schedules/:scheduleId', authenticateToken, ScheduleController.editSchedule);
router.delete('/schedules/:scheduleId', authenticateToken, ScheduleController.deleteSchedule);
router.get('/schedules/:scheduleId', authenticateToken, ScheduleController.getScheduleById);

// Маршрут для создания нового предмета
router.post('/subjects', SubjectController.createSubjects);

// Маршрут для получения всех предметов
router.get('/subjects', SubjectController.getAllSubjects);

// Route for creating lesson times
router.post('/lessontimes', LessonTimeController.createLessonTimes);
router.get('/lessontimes', LessonTimeController.getAllLessonTime);

// Роуты комментариев
router.post("/comments", authenticateToken, CommentController.createComment);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);

// Роуты Учителя
router.post('/teachers', TeacherController.createTeacher);
router.get('/teachers', TeacherController.getAllTeachers);


module.exports = router;
