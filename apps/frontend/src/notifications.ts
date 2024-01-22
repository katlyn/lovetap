import type { PushSubscriptionT } from "api-types/structures"

import api from "@/config/api"

function urlB64ToUint8Array (base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function subscribe (receiverId: string, editSecret: string) {
  const registration = await navigator.serviceWorker.getRegistration()
  if (registration === undefined) {
    return false
  }
  const keys = await api.keys.getKeys()
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(keys.public)
  })
  // TODO: Post keys to endpoint
  return api.receiver.addSubscription(receiverId, editSecret, subscription.toJSON() as PushSubscriptionT)
}

export async function requestPermission (): Promise<boolean> {
  const result = await Notification.requestPermission()
  if (result === "denied") {
    console.error("The user explicitly denied the permission request.")
    alert("Notification permission has been denied. You will not receive any taps from your receivers.")
    return false
  }
  if (result === "granted") {
    console.info("The user accepted the permission request.")
    return true
  }
  return false
}
