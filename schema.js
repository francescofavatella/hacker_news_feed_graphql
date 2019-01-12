const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

const topStoriesURL = `https://hacker-news.firebaseio.com/v0/topstories.json`;
const newStoriesURL = `https://hacker-news.firebaseio.com/v0/newstories.json`;
const bestStoriesURL = `https://hacker-news.firebaseio.com/v0/beststories.json`;

const getItemURL = storyId =>
  `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`;

const handleError = err => console.log(err);

const getItem = id =>
  axios
    .get(getItemURL(id))
    .then(res => res.data)
    .catch(handleError);

const getStories = url =>
  axios
    .get(url)
    .then(res => res.data.map(storyId => getItem(storyId)))
    .catch(handleError);

const StoryType = new GraphQLObjectType({
  name: "Story",
  fields: () => ({
    by: { type: GraphQLString },
    id: { type: GraphQLInt },
    score: { type: GraphQLInt },
    text: { type: GraphQLString },
    time: { type: GraphQLInt },
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    url: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    story: {
      type: StoryType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return getItem(args.id);
      }
    },
    topStories: {
      type: new GraphQLList(StoryType),
      resolve(parent, args) {
        return getStories(topStoriesURL);
      }
    },
    newStories: {
      type: new GraphQLList(StoryType),
      resolve(parent, args) {
        return getStories(newStoriesURL);
      }
    },
    bestStories: {
      type: new GraphQLList(StoryType),
      resolve(parent, args) {
        return getStories(bestStoriesURL);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
