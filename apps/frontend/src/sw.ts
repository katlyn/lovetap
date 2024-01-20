// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import type { NotificationT } from "api-types/structures"

self.addEventListener("push", async event => {
  if (!(event instanceof PushEvent) || event.data === null) {
    return
  }
  const notification: NotificationT = event.data.json()
  event.waitUntil(self.registration.showNotification(notification.title, notification.options))
})
