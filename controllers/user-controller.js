const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcryptjs');
const Jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserController = {
    register: async (req, res) => {
        const { email, password, name, roleName, class: classValue } = req.body;
        if (!email || !password || !name || !roleName) {
            return res.status(400).json({ error: "All fields are required!" });
        }
        try {
            const role = await prisma.role.findUnique({ where: { name: roleName } });

            if (!role) {
                return res.status(400).json({ error: 'Role does not exist' });
            }
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            let user;
            if (roleName === "Ученик") {
                if (!classValue) {
                    return res.status(400).json({ error: "Class is required for students" });
                }
                user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        roleId: role.id,
                        class: classValue
                    }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        roleId: role.id
                    }
                });
            }

            // Генерируем аватар для нового пользователя
            const png = Jdenticon.toPng(name, 200);
            const avatarName = `${name}_${Date.now()}.png`;
            const avatarPath = path.join(__dirname, '/../uploads', avatarName);
            fs.writeFileSync(avatarPath, png);
            user.avatarUrl = `/uploads/${avatarName}`;
            await prisma.user.update({
                where: { id: user.id },
                data: { avatarUrl: user.avatarUrl }
            });

            res.json(user)
        } catch (error) {
            console.error('Error in register', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }
    
        try {
            const user = await prisma.user.findUnique({ 
                where: { email }, 
                include: { role: true } 
            });
    
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
    
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
    
            // Check if user is a student, then class is required
            if (user.role.name === 'Ученик' && !user.class) {
                return res.status(400).json({ error: 'Class is required for students' });
            }
    
            // Generate token
            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
    
            res.json({ token, role: user.role }); // Include the role in the response
        } catch (error) {
            console.log('Login error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }, 
    getUserById: async (req, res) => {
        const userId = parseInt(req.params.id); // Получаем идентификатор пользователя из параметров запроса
    
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { role: true } // Включаем информацию о роли пользователя
            });
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.json(user);
        } catch (error) {
            console.error('Error in getUserById', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    //редактирование профиля
    updateUser: async (req, res) => {
        const userId = parseInt(req.params.id); // Получаем идентификатор пользователя из параметров запроса
        const { name, class: classValue } = req.body; // Получаем обновляемые данные из тела запроса
    
        try {
            // Проверяем существует ли пользователь
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Обновляем данные пользователя
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    class: classValue // Обновляем класс пользователя
                }
            });
    
            res.json(updatedUser);
        } catch (error) {
            console.error('Error in updateUser', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    current: async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.userId },
            });
    
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.log('Error in current', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteUser: async (req, res) => {
        const userId = parseInt(req.params.id);
    
        try {
            // Удаление пользователя с использованием метода delete Prisma
            await prisma.user.delete({
                where: { id: userId }
            });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await prisma.user.findMany({
                include: { role: true } // Включаем информацию о роли пользователя
            });
            res.json(users);
        } catch (error) {
            console.error('Error in getAllUsers', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    
}

module.exports = UserController;