import routeSchema from "api-types/routes"

import EndpointCollection from "./EndpointCollection.js"

export default class KeysCollection extends EndpointCollection {
  constructor(apiRoot: string) {
    super(new URL("keys/", apiRoot).toString())
  }
  getKeys () {
    return this.get("", routeSchema.keys.GET.response["200"])
  }
}
