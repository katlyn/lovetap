import webPush, {PushSubscription} from "web-push"
import env from "./env.js";
import {NotificationT} from "api-types/structures";

webPush.setVapidDetails(env.vapid.subject, env.vapid.public, env.vapid.private)

export function sendNotification (subscription: PushSubscription, notification: NotificationT) {
  return webPush.sendNotification(subscription, JSON.stringify(notification))
}

export default webPush
