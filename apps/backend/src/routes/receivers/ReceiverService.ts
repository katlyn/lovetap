import prisma from "../../config/prisma.js";
import * as crypto from "node:crypto"
import {InternalServerError} from "http-errors";
import {NotificationT} from "api-types/structures";
import {sendNotification} from "../../config/webPush.js";

function hashSecret (secret: string, salt: string) {
  return crypto.pbkdf2Sync(secret, salt, 1000, 64, "sha512").toString("hex")
}

function generateSecret (byteLength = 64) {
  return crypto.randomBytes(byteLength).toString("base64")
}

export default class ReceiverService {
  constructor () {
    throw new Error("Static class should not be constructed")
  }

  static async createReceiver (name: string) {
    const salt = generateSecret()
    const editSecret = generateSecret()
    const pushSecret = generateSecret()

    const receiver = await prisma.receiver.create({
      data: {
        name,
        secretSalt: salt,
        editSecretHash: hashSecret(editSecret, salt),
        pushSecretHash: hashSecret(pushSecret, salt)
      }
    })

    return {
      ...receiver,
      editSecret,
      pushSecret
    }
  }

  static async getPushSubscriptions (receiverId: string) {
    const subscriptions = await prisma.receiver.findUnique({
      where: { id: receiverId }
    }).subscriptions({ include: { keys: true } });

    if (subscriptions === null) {
      throw new InternalServerError(`unable to fetch PushSubscriptions for ${receiverId}`)
    }

    return subscriptions.map(subscription => {
      if (subscription.keys === null) {
        throw new InternalServerError(`invalid PushSubscription for ${receiverId}: ${subscription.id} has no keys`)
      }
      return {
        // This is kinda silly but typescript requires it to be done this way
        ...subscription,
        keys: subscription.keys
      }
    })
  }

  static async notifyReceiver (receiverId: string, notification: NotificationT) {
    const subscriptions = await ReceiverService.getPushSubscriptions(receiverId)
    return Promise.all(subscriptions.map(subscription => sendNotification(subscription, notification)))
  }

  static async sendMessage (receiverId: string, from: string, content?: string) {
    const message = await prisma.pushMessage.create({
      data: {
        receiverId,
        from,
        content
      }
    })

    await ReceiverService.notifyReceiver(receiverId, {
      title: `${from} thought of you`,
      options: {
        body: content
      }
    })

    return message
  }

  static verifySecret (secret: string, salt: string, targetHash: string): boolean {
    return hashSecret(secret, salt) === targetHash
  }
}