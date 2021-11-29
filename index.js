const { ApolloServer, gql } = require("apollo-server");
let booksData = [
  {
    bookId: 1,
    title: "title test1",
    message: "message test2",
    author: "author test2",
    url: "url test2",
  },
  {
    bookId: 2,
    title: "title test2",
    message: "message test2",
    author: "author test2",
    url: "url test2",
  },
];

// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    books: [Book]
    book(bookId: Int): Book
  }
  type Mutation {
    addBook(title: String, message: String, author: String, url: String): Book
    editBook(
      bookId: Int
      title: String
      message: String
      author: String
      url: String
    ): Book
    deleteBook(bookId: Int): Book
  }
  type Book {
    bookId: Int
    title: String
    message: String
    author: String
    url: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => "world",
    books: () => {
      return booksData;
    },
    book: (parent, args, context, info) => {
      return booksData.find((book) => book.bookId === args.bookId);
    },
  },
  Mutation: {
    addBook: (parent, args, context, info) => {
      const maxId = Math.max(...booksData.map((book) => book.bookId));
      const newBook = { ...args, bookId: maxId + 1 };

      booksData.push(newBook);

      return newBook;
    },
    editBook: (parent, args, context, info) => {
      const newBooks = booksData.map((book) => {
        if (book.bookId === args.bookId) {
          return args;
        } else {
          return book;
        }
      });

      booksData = newBooks;

      return args;
    },
    deleteBook: (parent, args, context, info) => {
      const deleted = booksData.find((book) => book.bookId === args.bookId);
      const newBooks = booksData.filter((book) => book.bookId !== args.bookId);

      booksData = newBooks;

      return deleted;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
