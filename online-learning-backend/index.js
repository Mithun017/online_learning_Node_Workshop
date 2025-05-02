require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');
const connectDB = require('./config/db');
const authMiddleware = require('./auth/auth');
const app = express();

connectDB();

app.use(express.json());
app.use('/graphql', (req, res, next) => {
  const user = authMiddleware(req);
  return graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: { user },
  })(req, res, next);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
