// import express from "express";
// import { buildSchema } from "graphql";
// import { createHandler } from "graphql-http/lib/use/express";
// import { ruruHTML } from "ruru/server";

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//     age: Int
//     ip: String
//     quoteOfTheDay: String
//     random: Float!
//     rollThreeDice: [Int]
//     rollDice(numDice: Int!, numSides: Int): [Int]
//   }
// `);

// function loggingMiddleware(req, res, next) {
//   console.log("Request Ip: ", req.ip);
//   next();
// }

// // The rootValue provides a resolver function for each API endpoint
// var rootValue = {
//   hello() {
//     return "Hello world!";
//   },
//   // age: 25,
//   age: () => {
//     return 25;
//   },
//   ip(args, context) {
//     return context.ip;
//   },
//   quoteOfTheDay() {
//     return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
//   },
//   random() {
//     return Math.random();
//   },
//   rollThreeDice() {
//     return [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6));
//   },
//   rollDice({ numDice, numSides }) {
//     const output = [];
//     for (let i = 0; i < numDice; i++) {
//       output.push(1 + Math.floor(Math.random() * (numSides || 6)));
//     }
//     return output;
//   },
// };

// // Run the GraphQL query '{ hello }' and print out the response
// // graphql({
// //   schema,
// //   source: "{ age }",
// //   rootValue,
// // }).then((response) => {
// //   console.log(response);
// // });

// const app = express();

// app.use(loggingMiddleware);

// app.all(
//   "/graphql",
//   createHandler({
//     schema,
//     rootValue,
//     context: (req) => {
//       return { ip: req.raw.ip };
//     },
//   })
// );

// app.get("/", (_req, res) => {
//   res.type("html");
//   res.end(ruruHTML({ endpoint: "/graphql" }));
// });

// app.listen(4000, () => {
//   console.log("Running a GraphQL API server at http://localhost:4000/graphql");
// });

import express from "express";
import {
  buildSchema,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

const app = express();

// var schema = buildSchema(`
//   type RandomDice {
//     numSide: Int!
//     rollOnce: Int!
//     roll(numRolls: Int!): [Int]
//   }

//   type User {
//     id: Int
//     name: String
//   }

//   type Query {
//     getDice(numSides: Int!): RandomDice
//     hello(name:String!): String
//     user: User
//   }
//   `);

// class RandomDice {
//   constructor(numSide) {
//     this.numSide = numSide;
//   }

//   rollOnce() {
//     return 1 + Math.floor(Math.random() * this.numSide);
//   }

//   roll({ numRolls }) {
//     const output = [];
//     for (let i = 0; i < numRolls; i++) {
//       output.push(this.rollOnce());
//     }
//     return output;
//   }
// }

const user = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLInt },
    name: {
      type: GraphQLString,
      resolve: (obj) => {
        const name = obj.name.toUpperCase();
        if (obj.isAdmin) {
          return `${name} (Admin)`;
        }
        return name;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => {
          return "Hello world!";
        },
      },
      user: {
        type: user,
        resolve: () => {
          return { id: 1, name: "Alice", extra: "Hey", isAdmin: true };
        },
      },
    },
  }),
});

// var rootValue = {
//   // getDice({ numSides }) {
//   //   return new RandomDice(numSides);
//   // },

//   hello: ({ name }) => {
//     return "Hello " + name;
//   },

//   user: () => {
//     return { id: 1, name: "Alice" };
//   },
// };

// app.all(
//   "/graphql",
//   createHandler({
//     schema,
//     rootValue,
//   })
// );

app.all(
  "/graphql",
  createHandler({
    schema,
  })
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
