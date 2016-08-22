import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLID
} from 'graphql';
import {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,
  mutationWithClientMutationId,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection
} from 'graphql-relay';
import { connectionFromMongooseQuery } from 'relay-mongodb-connection';

import { geocode, createAddress } from '../utils';
import * as types from '../models';
const { User, Room, Property, Advertisement } = types;


const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    return types[type].findOne({ _id: id});
  },
  (obj) => {
    if (obj instanceof User){
      return UserType;
    } else if (obj instanceof Room){
      return RoomType;
    } else if (obj instanceof Property){
      return PropertyType;
    } else if (obj instanceof Advertisement){
      return AdType;
    }

    return null;
  }
);


const UserType = new GraphQLObjectType({
  name: 'User',
  fields(){
    return {
      id: globalIdField('User', user => user._id),
      email: { type: GraphQLString },
      country: { type: GraphQLString },
      street: { type: GraphQLString },
      postalCode: { type: GraphQLString },
      city: { type: GraphQLString },
      phone: { type: GraphQLString },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      dataJoined: { type: GraphQLString },
      properties: {
        type: PropertyConnection,
        args: connectionArgs,
        resolve: ({ _id }, args) => {
          return connectionFromMongooseQuery(Property.find({ user: _id }), args);
        }
      },
      favourites: {
        type: AdConnection,
        args: connectionArgs,
        resolve: ({ favourites } , args) => {
          return connectionFromMongooseQuery(favourites);
        }
      },

      ads: {
        type: AdConnection,
        args: connectionArgs,
        resolve: (_ , args) => {
          return connectionFromMongooseQuery(Advertisement.find(), args);
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

const { connectionType: UserConnection, edgeType: UserEdge } =
  connectionDefinitions({ name: 'User', nodeType: UserType });


const RoomType = new GraphQLObjectType({
  name: 'Room',
  description: 'room',
  fields(){
    return {
      id: globalIdField('Room', room => room._id),
      property: {
        type: PropertyType,
        resolve: ({ property }) => {
          return Property.findOne({ _id: property });
        }
      },
      roomsType: { type: GraphQLInt },
      name: { type: GraphQLString },
      area: { type: GraphQLFloat },
      freePlaces: { type: GraphQLInt },
      equipment: { type: new GraphQLList(GraphQLString) },
      images: { type: new GraphQLList(GraphQLString) }
    };
  },
  interfaces: [nodeInterface]
});

const { connectionType: RoomConnection, edgeType: RoomEdge } =
  connectionDefinitions({ name: 'Room', nodeType: RoomType });


const PropertyType = new GraphQLObjectType({
  name: 'Property',
  description: 'Property',
  fields(){
    return {
      id: globalIdField('Property', property => property._id),
      user: {
        type: UserType,
        resolve: ({ user }) => {
          return User.findOne({ _id: user});
        }
      },
      country: { type: GraphQLString },
      street: { type: GraphQLString },
      postalCode: { type: GraphQLString },
      city: { type: GraphQLString },
      buildingType: { type: GraphQLInt },
      name: { type: GraphQLString },
      area: { type: GraphQLFloat },
      totalPlaces: { type: GraphQLInt },
      coords: { type: new GraphQLList(GraphQLFloat) },
      rooms: {
        type: RoomConnection,
        resolve: ({ _id, rooms }, args) => {
          let roomsWithProperty = rooms.map(room => ({ property: _id, ...room}));
          return connectionFromArray(roomsWithProperty, args);
        }
      },
      numberOfRooms: {
        type: GraphQLInt,
        resolve: ({ rooms }) => rooms.length
      },
      advertisement: {
        type: AdType,
        resolve: ({ advertisement }) => {
          return Advertisement.findOne({ _id: advertisement});
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

const { connectionType: PropertyConnection, edgeType: PropertyEdge } =
  connectionDefinitions({ name: 'Property', nodeType: PropertyType });


const AdType = new GraphQLObjectType({
  name: 'Advertisement',
  description: 'Advertisement',
  fields(){
    return {
      id: globalIdField('Advertisement', ad => ad._id),
      property: {
        type: PropertyType,
        resolve: ({ property }) => {
          return Property.findOne({ _id: property });
        }
      },
      payment: { type: GraphQLInt },
      price: { type: GraphQLInt },
      freePlaces: { type: GraphQLInt },
      image: { type: GraphQLString }
    };
  },
  interfaces: [nodeInterface]
});

const { connectionType: AdConnection, edgeType: AdEdge } =
  connectionDefinitions({ name: 'Advertisement', nodeType: AdType });


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields(){
    return {
      user: {
        type: UserType,
        resolve: () => User.findOne()
      },
      create: {
        type: GraphQLInt,
        resolve: () => {
          Property.findOne().then(property => {
            console.log(property);
            new Advertisement({
              property: property._id,
              payment: 1,
              price: 700,
              freePlaces: 3,
              image: 'flat.jpg'
            }).save();
          });
        }
      },
      node: nodeField
    };
  }
});

const RoomInput = new GraphQLInputObjectType({
  name: 'RoomInput',
  fields(){
    return {
      roomsType: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      area: { type: new GraphQLNonNull(GraphQLFloat) },
      freePlaces: { type: new GraphQLNonNull(GraphQLInt) },
      equipment: { type: new GraphQLList(GraphQLString) },
      images: { type: new GraphQLList(GraphQLString) }
    };
  }
});

// Properties Mutation

const CreateProperty = mutationWithClientMutationId({
  name: 'CreateProperty',
  description: 'Inserting new property',
  inputFields: {
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString)},
    city: { type: new GraphQLNonNull(GraphQLString) },
    buildingType: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    area: { type: new GraphQLNonNull(GraphQLFloat) },
    totalPlaces: { type: new GraphQLNonNull(GraphQLInt) },
    rooms: { type: new GraphQLList(RoomInput) }
  },
  outputFields: {
    property: {
      type: PropertyType,
      resolve: (product) => {
        return product;
      }
    }
  },
  mutateAndGetPayload: (args) => {
    return User.findOne().then(user => {
      return geocode(createAddress(args)).then(coords => {
        return new Property({
          user: user._id,
          coords,
          ...args
        }).save();
      });
    });
  }
});

const RemoveProperty = mutationWithClientMutationId({
  name: 'RemoveProperty',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    deletedPropertyId: {
      type: GraphQLID,
      resolve: ({ id }) => id
    }
  },
  mutateAndGetPayload: ({ id }) => {
    const localPropertyId = fromGlobalId(id).id;
    return Property.remove({ _id: localPropertyId })
      .then(() => localPropertyId);
  }
});

// TODO: EditProperty

// Room mutation

const CreateRoom = mutationWithClientMutationId({
  name: 'CreateRoom',
  inputFields: {
      property: { type: new GraphQLNonNull(GraphQLString) },
      roomsType: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      area: { type: new GraphQLNonNull(GraphQLFloat) },
      freePlaces: { type: new GraphQLNonNull(GraphQLInt) },
      equipment: { type: new GraphQLList(GraphQLString) },
      images: { type: new GraphQLList(GraphQLString) }
  },
  outputFields: {
    roomEdge: {
      type: RoomEdge,
      resolve: ({ rooms }) => {
        return {
          cursor: cursorForObjectInConnection(rooms, room),
          node: room
        };
      }
    }
  },
  mutateAndGetPayload: (args) => {
    return Property.findOneAndUpdate(
      { _id: args.property },
      { $push: {"rooms": args }},
      { new: true }
    );
  }
});

const EditRoom = mutationWithClientMutationId({
  name: 'EditRoom',
  inputFields: {
      property: { type: new GraphQLNonNull(GraphQLString) },
      roomsType: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      area: { type: new GraphQLNonNull(GraphQLFloat) },
      freePlaces: { type: new GraphQLNonNull(GraphQLInt) },
      equipment: { type: new GraphQLList(GraphQLString) },
      images: { type: new GraphQLList(GraphQLString) }
  },
  outputFields: {
    roomEdge: {
      type: RoomEdge,
      resolve: ({ rooms }) => {
        return {
          cursor: cursorForObjectInConnection(rooms, room),
          node: room
        };
      }
    }
  },
  mutateAndGetPayload: (args) => {
    Property.findOneAndUpdate(
      { _id: args.property, 'rooms._id': args._id },
      { $set: args },
      { new: true }
    );
  }
});

const RemoveRoom = mutationWithClientMutationId({
  name: 'RemoveRoom',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    property: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    deletedRoomId: {
      type: GraphQLID,
      resolve: ({ id }) => id
    },
    property: {
      type: PropertyType,
      resolve: (property) => property
    }
  },
  mutateAndGetPayload: ({ id, property }) => {
    const localRoomId = fromGlobalId(id).id;
    const localPropertyId = fromGlobalId(property).id;

    return Property.update( { _id: property}, { $pull: { rooms: id }});
  }
});


const CreateAdvertisement = mutationWithClientMutationId({
  name: 'CreateAdvertisement',
  inputFields: {
    property: { type: new GraphQLNonNull(GraphQLID) },
    payment: { type: new GraphQLNonNull(GraphQLInt) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    freePlaces: { type: GraphQLInt }
  },
  outputFields: {
    advertisement: {
      type: AdType,
      resolve: (ad) => ad
    }
  },
  mutateAndGetPayload: ({ property, payment, price, freePlaces }) => {
    return new Advertisement({ property, payment, price, freePlaces }).save();
  }
});

const EditAdvertisement = mutationWithClientMutationId({
  name: 'EditAdvertisement',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    payment: { type: new GraphQLNonNull(GraphQLInt) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    freePlaces: GraphQLInt
  },
  outputFields: {
    advertisement: {
      type: AdType,
      resolve: (ad) => ad
    }
  },
  mutateAndGetPayload: ({ id, payment, price, freePlaces }) => {
    const localAdvertisementId = fromGlobalId(id).id;
    return new Advertisement.finOneAndUpdate(
      { _id : localAdvertisementId },
      { payment, price, freePlaces }).save();
  }
});

const RemoveAdvertisement = mutationWithClientMutationId({
  name: 'RemoveAdvertisement',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    deletedAdId: {
      type: GraphQLID,
      resolve: ({ id }) => id
    }
  },
  mutateAndGetPayload: ({ id }) => {
    const localAdId = fromGlobalId(id).id;
    return Property.remove({ _id: localAdId })
      .then(() => localAdId);
  }
});

const AddToFavourites = mutationWithClientMutationId({
  name: 'AddToFavourites',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: () => User.findOne() //TODO: Get user from context
    }
  },
  mutateAndGetPayload: ({ id }) => {
    const localAdId = fromGlobalId(id).id;
    return User.findByIdAndUpdate( id,
      { $push: { favourites: id }},
      { new: true }
    );
  }
});

const Mutation = new GraphQLObjectType({
  name: 'GraphQLMutation',
  fields(){
    return {
      createProperty: CreateProperty,
      // editProperty: EditProperty,
      removeProperty: RemoveProperty,
      // Room mutation
      createRoom: CreateRoom,
      editRoom: EditRoom,
      removeRoom: RemoveRoom,
      createAdvertisement: CreateAdvertisement,
      editAdvertisement: EditAdvertisement,
      removeAdvertisement: RemoveAdvertisement,
      addToFavourites: AddToFavourites,
      removeFromFavourites: RemoveFromFavourites
      
    };
  }
});

export default new GraphQLSchema({query: Query});
