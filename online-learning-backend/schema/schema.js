const { buildSchema } = require('graphql');
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    duration: String!
    lessons: [String!]!
    instructorId: ID!
  }

  type Progress {
    id: ID!
    userId: ID!
    courseId: ID!
    completedLessons: [String!]!
  }

  type Query {
    getCourses: [Course]
    getCourse(id: ID!): Course
    getProgress(userId: ID!): [Progress]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): String
    login(email: String!, password: String!): String
    createCourse(title: String!, description: String!, duration: String!, lessons: [String!]!): Course
    enrollCourse(courseId: ID!): Progress
    updateProgress(courseId: ID!, lesson: String!): Progress
  }
`);
module.exports = schema;
