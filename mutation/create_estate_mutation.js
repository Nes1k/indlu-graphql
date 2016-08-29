import Relay, { Mutation } from 'react-relay';

export default class CreateEstateMutation extends Mutation {

  getMutation(){
     return Relay.QL`mutation { createEstate }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        estate: this.props.estate.id
      }
    },{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on CreateEstatePayload {
          estate {
            id
          }
        }
      `]
    }];
  }

  getFatQuery(){
    return Relay.QL`
      fragment on CreateEstatePayload {
        estate {
          id
        }
      }
    `;
  }

  getVariables(){
    const { country, street, postalCode, city, buildingType, name } = this.props.estate;
    return {
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
