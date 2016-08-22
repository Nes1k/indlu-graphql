var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../app_server/schemas/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
