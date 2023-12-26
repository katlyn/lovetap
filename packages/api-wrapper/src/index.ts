import EndpointCollection from "./EndpointCollection.js"
import ReceiverCollection from "./ReceiverCollection.js"

export default class Api extends EndpointCollection {
  receiver = new ReceiverCollection(this.apiRoot)
}
