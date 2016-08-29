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
const { User, Room, Estate, Advertisement } = types;


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
    } else if (obj instanceof Estate){
      return EstateType;
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
      estates: {
        type: EstateConnection,
        args: connectionArgs,
        resolve: ({ _id }, args) => {
          return connectionFromMongooseQuery(Estate.find({ user: _id }), args);
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
      estate: {
        type: EstateType,
        resolve: ({ estate }) => {
          return Estate.findOne({ _id: estate });
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


const EstateType = new GraphQLObjectType({
  name: 'Estate',
  description: 'Estate',
  fields(){
    return {
      id: globalIdField('Estate', estate => estate._id),
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
          let roomsWithEstate = rooms.map(room => ({ estate: _id, ...room}));
          return connectionFromArray(roomsWithEstate, args);
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

const { connectionType: EstateConnection, edgeType: EstateEdge } =
  connectionDefinitions({ name: 'Estate', nodeType: EstateType });


const AdType = new GraphQLObjectType({
  name: 'Advertisement',
  description: 'Advertisement',
  fields(){
    return {
      id: globalIdField('Advertisement', ad => ad._id),
      estate: {
        type: EstateType,
        resolve: ({ estate }) => {
          return Estate.findOne({ _id: estate });
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
      estate: {
        type: EstateType,
        args: {
          id: {
            type: GraphQLID
          }
        },
        resolve: (_, { id }) => {
          const localEstateId = fromGlobalId(id).id;
          return Estate.findOne({_id: localEstateId})
            .then(estate => {
              if(!estate)
                return {_id: null};

              return estate;
            });

        }
      },
      create: {
        type: GraphQLInt,
        resolve: () => {
          Estate.findOne().then(estate => {
            new Advertisement({
              estate: estate._id,
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

// Estates Mutation

const CreateEstate = mutationWithClientMutationId({
  name: 'CreateEstate',
  description: 'Inserting new Estate',
  inputFields: {
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString)},
    city: { type: new GraphQLNonNull(GraphQLString) },
    buildingType: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    estate: {
      type: EstateType,
      resolve: (estate) => {
        return estate;
      }
    }
  },
  
  mutateAndGetPayload: (args) => {
    return User.findOne().then(user => {
      return geocode(createAddress(args)).then(coords => {
        return new Estate({
          user: user._id,
          coords,
          ...args
        }).save().then(estate => estate);
      });
    });
  }
});


const EditEstate = mutationWithClientMutationId({
  name: 'EditEstate',
  description: 'Edit Estate',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString)},
    city: { type: new GraphQLNonNull(GraphQLString) },
    buildingType: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    estate: {
      type: EstateType,
      resolve: (estate) => {
        return estate;
      }
    }
  },
  mutateAndGetPayload: ({ id, ...args }) => {
      return geocode(createAddress(args)).then(coords => {
        return Estate.findOneAndUpdate(
          { _id: id },
          { coords, ...args },
          { new: true });
      });
  }
});


const RemoveEstate = mutationWithClientMutationId({
  name: 'RemoveEstate',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    deletedEstateId: {
      type: GraphQLID,
      resolve: ({ id }) => id
    }
  },
  mutateAndGetPayload: ({ id }) => {
    const localEstateId = fromGlobalId(id).id;
    return Estate.remove({ _id: localEstateId })
      .then(() => localEstateId);
  }
});

// TODO: EditEstate

// Room mutation

const CreateRoom = mutationWithClientMutationId({
  name: 'CreateRoom',
  inputFields: {
      estate: { type: new GraphQLNonNull(GraphQLString) },
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
    return Estate.findOneAndUpdate(
      { _id: args.estate },
      { $push: {"rooms": args }},
      { new: true }
    );
  }
});

const EditRoom = mutationWithClientMutationId({
  name: 'EditRoom',
  inputFields: {
      estate: { type: new GraphQLNonNull(GraphQLString) },
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
    Estate.findOneAndUpdate(
      { _id: args.estate, 'rooms._id': args._id },
      { $set: args },
      { new: true }
    );
  }
});

const RemoveRoom = mutationWithClientMutationId({
  name: 'RemoveRoom',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    estate: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    deletedRoomId: {
      type: GraphQLID,
      resolve: ({ id }) => id
    },
    estate: {
      type: EstateType,
      resolve: (estate) => estate
    }
  },
  mutateAndGetPayload: ({ id, estate }) => {
    const localRoomId = fromGlobalId(id).id;
    const localEstateId = fromGlobalId(estate).id;

    return Estate.update( { _id: estate}, { $pull: { rooms: id }});
  }
});


const CreateAdvertisement = mutationWithClientMutationId({
  name: 'CreateAdvertisement',
  inputFields: {
    estate: { type: new GraphQLNonNull(GraphQLID) },
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
  mutateAndGetPayload: ({ estate, payment, price, freePlaces }) => {
    return new Advertisement({ estate, payment, price, freePlaces }).save();
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
    return Estate.remove({ _id: localAdId })
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
      createEstate: CreateEstate,
      editEstate: EditEstate
      /* removeEstate: RemoveEstate,
       * // Room mutation
       * createRoom: CreateRoom,
       * editRoom: EditRoom,
       * removeRoom: RemoveRoom,
       * createAdvertisement: CreateAdvertisement,
       * editAdvertisement: EditAdvertisement,
       * removeAdvertisement: RemoveAdvertisement,
       * addToFavourites: AddToFavourites,
       * removeFromFavourites: RemoveFromFavourites*/
      
    };
  }
});

export default new GraphQLSchema({query: Query, mutation: Mutation});
