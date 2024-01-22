import {Type} from "@sinclair/typebox";

export default {
  GET: {
    response: {
      "200": Type.Object({
        public: Type.String()
      })
    }
  }
}
