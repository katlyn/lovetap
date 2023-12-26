// Add custom transformation ability to AJV, allowing us to parse dates automatically
import { FuncKeywordDefinition } from "ajv/dist/types"

const customTransformKeyword: FuncKeywordDefinition = {
  keyword: "customTransform",
  type: "string",
  errors: false,
  valid: true,
  modifying: true,
  compile: function (schema) {
    return async function (data, dataPath) {
      if (data == null || dataPath == null) {
        return
      }

      switch (schema) {
        case "date-time": {
          data = new Date(data)
          break
        }
      }

      dataPath.parentData[dataPath.parentDataProperty] = data
    }
  }
}

export default customTransformKeyword
