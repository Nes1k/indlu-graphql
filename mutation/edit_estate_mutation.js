import Relay, { Mutation } from 'react-relay';

export default class EditEstateMutation extends Mutation {

  static fragments = {
    estate: () => Relay.QL`
      fragment on Estate {
        id
        country
        street
        postalCode
        city
        buildingType
        name
      }
    `
  }

  getMutation(){
    return Relay.QL`mutation { editEstate }`;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on EditEstatePayload {
          estate {
            id
          }
        }
      `]
    }];
  }

  getFatQuery(){
    return Relay.QL`
      fragment on EditEstatePayload {
        estate {
          id
        }
      }
    `;
  }

  getVariables(){
    const { id, country, street, postalCode, city, buildingType, name } = this.props.estate;
    return {
      id,
      country,
      street,
      postalCode,
      city,
      buildingType,
      name
    };
  }

  // getOptimisticResponse(){
  
  // }
}
