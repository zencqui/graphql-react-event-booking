const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require("mongoose");
const graphQlSchema = require('./ggraphql/schema/index')
const graphQlResolvers = require('./ggraphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlhttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://mongoadmin:3uxnjPVYYMZOYnBO@cluster0-xrdht.azure.mongodb.net/graphql-react-event-booking?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});



