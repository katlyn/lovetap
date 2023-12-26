import {TSchema, Type} from "@sinclair/typebox"

export const Nullable = (type: TSchema) => Type.Union([type, Type.Null()])

// A basic UUID param object
export const UUIDParam = Type.Object({ id: Type.String({ format: "uuid" }) })

// A basic authentication header validator
export const AuthenticationHeader = Type.Object({
  authorization: Type.String()
})

// We can rely on Date to be stringified to a date-time string safely. This allows us to use Date objects in our schemas
export const UnsafeDate = Type.Unsafe<Date>({ type: "string", format: "date-time", customTransform: "date-time" })
