const  fetch = require("node-fetch");
const { ApolloServer, gql, IResolverObject } = require("apollo-server");
const RandomUserDataSource = require("./RandomUserDataSource");

const typeDefs = gql`
  type Person {
    gender: String
    email: String
    phone: String
  }

  type Query {
    randomPerson: [Person!]!
    randomPerson2: [Person!]!
  }
`;

const resolvers = {
  Query: {
    randomPerson: async () => {
      const response = await fetch("https://api.randomuser.me/");
      const data = await response.json();
      return data.results;
    },
    randomPerson2: (_, __, { dataSources }) => {
      return dataSources.randomUserAPI.getPerson();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    randomUserAPI: new RandomUserDataSource()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
