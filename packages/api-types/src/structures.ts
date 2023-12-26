import { Type, Static } from "@sinclair/typebox";
import {Nullable, UnsafeDate} from "./util.js";

export type ReceiverT = Static<typeof Receiver>
const Receiver = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  created: UnsafeDate
})

const ReceiverCreateOrUpdate = Type.Object({
  name: Type.String()
})

const ReceiverAuthenticationDetails = Type.Object({
  editSecret: Type.String(),
  pushSecret: Type.String()
})

const ReceiverWithAuthenticationDetails = Type.Composite([Receiver, ReceiverAuthenticationDetails])

export type PushMessageT = Static<typeof PushMessage>
const PushMessage = Type.Object({
  id: Type.String({ format: "uuid" }),
  receiverId: Type.String({ format: "uuid" }),
  from: Type.String(),
  content: Nullable(Type.String()),
  created: UnsafeDate
})

const PushMessageCreate = Type.Object({
  from: Type.String(),
  content: Type.Optional(Type.String())
})

export type NotificationOptionsT = Static<typeof NotificationOptions>
const NotificationOptions = Type.Partial(Type.Object({
  body: Type.String(),
  renotify: Type.Boolean(),
  tag: Type.String(),
  timestamp: Type.Number()
}))

export type NotificationT = Static<typeof Notification>
const Notification = Type.Object({
  title: Type.String(),
  options: Type.Optional(NotificationOptions)
})


export default {
  Receiver,
  ReceiverCreateOrUpdate,
  ReceiverAuthenticationDetails,
  ReceiverWithAuthenticationDetails,
  PushMessage,
  PushMessageCreate,
  Notification,
  NotificationOptions
}
