const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
require('dotenv').config();

const dbPassword = process.env.DB_PSWD;
const schema = require('./schema/schema');

const app = express();

// Connect Mongoose directly to your MongoDB Atlas cluster
mongoose.connect(`mongodb+srv://abiversion3_db_user:${encodeURIComponent(dbPassword)}@cluster0.onstsdg.mongodb.net/test?retryWrites=true&w=majority`)
  .then(() => console.log('Connected to MongoDB Atlas via Mongoose!'))
  .catch(err => console.error('Connection error:', err));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log("Running on Port: 4000");
});