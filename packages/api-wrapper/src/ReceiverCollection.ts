import { Static } from "@sinclair/typebox"
import routeSchema from "api-types/routes"

import EndpointCollection from "./EndpointCollection.js"

export default class ReceiverCollection extends EndpointCollection {
  constructor(apiRoot: string) {
    super(new URL("receivers/", apiRoot).toString())
  }

  createReceiver (data: Static<typeof routeSchema.receivers.POST.body>) {
    return this.post("", data, routeSchema.receivers.POST.response["201"])
  }

  getReceiver (id: string) {
    return this.get(`${id}`, routeSchema.receivers[":id"].GET.response["200"])
  }

  updateReceiver (id: string, data: Static<typeof routeSchema.receivers[":id"]["PATCH"]["body"]>) {
    return this.patch(`${id}`, data, routeSchema.receivers[":id"].PATCH.response["200"])
  }

  deleteReceiver (id: string) {
    return this.delete(`${id}`, routeSchema.receivers[":id"].DELETE.response["204"])
  }
}
