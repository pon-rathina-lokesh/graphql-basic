const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull} = graphql;

// const books = [
//   { id: "1", name: "Dune", genre: "Science Fiction", authorId: '1' },
//   { id: "2", name: "The Hobbit", genre: "Fantasy", authorId: '2' },
//   { id: "3", name: "1984", genre: "Dystopian", authorId: '3' },
//   { id: "4", name: "To Kill a Mockingbird", genre: "Classic Fiction", authorId: '2' },
//   { id: "5", name: "The Shining", genre: "Horror", authorId: '3' }
// ];

// const authors = [
//   { id: "1", name: "Frank Herbert", age: 65 },
//   { id: "2", name: "J.R.R. Tolkien", age: 81 },
//   { id: "3", name: "George Orwell", age: 46 },
// ];

const authorType = new GraphQLObjectType({
    name:'Author',
    fields:() => ({
        id: {type:GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(bookType),
            resolve(parent, arge){
                // return _.filter(books, {authorId: parent.id})
                return Book.find({authorId: parent.id});
        }}
    })
});


const bookType = new GraphQLObjectType({
    name:'Book',
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author:{
            type: authorType,
            resolve(parent, args){
                // return _.find(authors, {id: parent.authorId})
                return Author.findById(parent.authorId);
            }
        }
    })
});

const rootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type: bookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //Code to get data from db
                // return _.find(books,{id: args.id});
                return Book.findById(args.id);
            }
        },
        author:{
            type: authorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //Code to get data from db
                // return _.find(authors,{id: args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(bookType),
            resolve(parent, args){
                // return books;
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(authorType),
            resolve(parent, args){
                // return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields: {
        addAuthor: {
            type: authorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: bookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: Mutation
});