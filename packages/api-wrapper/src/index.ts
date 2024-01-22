import EndpointCollection from "./EndpointCollection.js"
import ReceiverCollection from "./ReceiverCollection.js"
import KeysCollection from "./KeysCollection.js";

export default class Api extends EndpointCollection {
  keys = new KeysCollection(this.apiRoot)
  receiver = new ReceiverCollection(this.apiRoot)
}
