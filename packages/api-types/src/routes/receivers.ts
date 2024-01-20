import {AuthenticationHeader, UUIDParam} from "../util.js";
import structures from "../structures.js";
import {Type} from "@sinclair/typebox";

export default {
  POST: {
    body: structures.ReceiverCreateOrUpdate,
    response: {
      "201": structures.ReceiverWithAuthenticationDetails
    }
  },
  ":id": {
    GET: {
      params: UUIDParam,
      response: {
        "200": structures.Receiver
      }
    },
    PATCH: {
      params: UUIDParam,
      headers: AuthenticationHeader,
      body: structures.ReceiverCreateOrUpdate,
      response: {
        "200": structures.Receiver
      }
    },
    DELETE: {
      params: UUIDParam,
      headers: AuthenticationHeader,
      response: {
        "204": Type.Null()
      }
    },
    "/subscriptions": {
      POST: {
        params: UUIDParam,
        body: structures.PushSubscription,
        response: {
          "204": Type.Null()
        }
      }
    },
    "/messages": {
      POST: {
        params: UUIDParam,
        body: structures.PushMessageCreate,
        response: {
          "201": structures.PushMessage
        }
      }
    }
  }
}
