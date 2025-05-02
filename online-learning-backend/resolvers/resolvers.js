const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

const resolvers = {
  getCourses: async () => await Course.find(),

  getCourse: async ({ id }) => await Course.findById(id),

  getProgress: async ({ userId }) => await Progress.find({ userId }),

  register: async ({ name, email, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    return 'User registered successfully';
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return token;
  },

  createCourse: async ({ title, description, duration, lessons }, context) => {
    if (!context.user || context.user.role !== 'instructor') throw new Error('Unauthorized');
    const course = new Course({ title, description, duration, lessons, instructorId: context.user.id });
    return await course.save();
  },

  enrollCourse: async ({ courseId }, context) => {
    if (!context.user) throw new Error('Unauthorized');
    const existing = await Progress.findOne({ userId: context.user.id, courseId });
    if (existing) return existing;
    const progress = new Progress({ userId: context.user.id, courseId, completedLessons: [] });
    return await progress.save();
  },

  updateProgress: async ({ courseId, lesson }, context) => {
    if (!context.user) throw new Error('Unauthorized');
    const progress = await Progress.findOne({ userId: context.user.id, courseId });
    if (!progress.completedLessons.includes(lesson)) progress.completedLessons.push(lesson);
    return await progress.save();
  },
};
module.exports = resolvers;