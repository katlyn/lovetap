import { Static, TSchema } from "@sinclair/typebox"
import _Ajv, { SchemaObject } from "ajv"
import customTransformKeyword from "ajv-custom-transform"
import _addFormats from "ajv-formats"

// TODO: Hopefully AJV will fix their types at some point but this will work for now
//   see also: https://github.com/ajv-validator/ajv/issues/2132#issuecomment-1290409907
const Ajv = _Ajv.default
const addFormats = _addFormats.default

const ajv = addFormats(new Ajv({}), [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex"
])

ajv.addKeyword(customTransformKeyword)

export default abstract class RequestCollection {
  readonly apiRoot: string

  constructor (apiRoot: string) {
    this.apiRoot = apiRoot
  }

  async fetch<T = unknown>(path: string, options: RequestInit, schema?: SchemaObject): Promise<T> {
    const response = await fetch(new URL(path, this.apiRoot), {
      credentials: "include",
      ...options
    })

    if (!response.ok) {
      throw await response.json()
    }

    if (response.status === 204) {
      return null as T
    }

    const json = await response.json() as T

    if (schema === undefined) {
      return json
    }

    const validator = ajv.compile(schema)
    const validationSuccess = validator(json)

    if (!validationSuccess) {
      throw validator.errors
    }

    return json
  }

  async delete<T extends TSchema>(path: string, schema: T, options: RequestInit = {}) {
    return this.fetch<Static<typeof schema>>(path, {
      ...options,
      method: "DELETE"
    }, schema)
  }

  async get<T extends TSchema>(path: string, schema: T, options: RequestInit = {}) {
    return this.fetch<Static<typeof schema>>(path, options, schema)
  }

  async patch<T extends TSchema>(path: string, body: Record<string, any>, schema: T, options: RequestInit = {}) {
    return this.fetch<Static<typeof schema>>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        ...options.headers,
        "Content-Type": "application/json"
      }
    }, schema)
  }

  async post<T extends TSchema>(path: string, body: Record<string, any>, schema: T, options: RequestInit = {}) {
    return this.fetch<Static<typeof schema>>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...options.headers,
        "Content-Type": "application/json"
      }
    }, schema)
  }
}
