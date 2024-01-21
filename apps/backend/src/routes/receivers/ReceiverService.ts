import prisma from "../../config/prisma.js";
import * as crypto from "node:crypto"
import httpErrors from "http-errors";
import {NotificationT, PushSubscriptionT} from "api-types/structures";
import {sendNotification} from "../../config/webPush.js";

function errHasStatusCode<T>(err: T): err is T & { statusCode: number } {
  return typeof err === "object" && err !== null && "statusCode" in err && typeof err.statusCode === "number"
}

function hashSecret (secret: string, salt: string) {
  return crypto.pbkdf2Sync(secret, salt, 1000, 64, "sha512").toString("hex")
}

function generateSecret (byteLength = 64) {
  return crypto.randomBytes(byteLength).toString("hex")
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

  static async addPushSubscription (receiverId: string, subscription: PushSubscriptionT) {
    return prisma.pushSubscription.create({
      data: {
        receiverId,
        endpoint: subscription.endpoint,
        // TODO: figure out why these types are weird
        expirationTime: subscription.expirationTime as Date|null,
        keys: {
          create: subscription.keys
        }
      }
    })
  }

  static async getPushSubscriptions (receiverId: string) {
    const subscriptions = await prisma.receiver.findUnique({
      where: { id: receiverId }
    }).subscriptions({ include: { keys: true } });

    if (subscriptions === null) {
      throw new httpErrors.InternalServerError(`unable to fetch PushSubscriptions for ${receiverId}`)
    }

    return subscriptions.map(subscription => {
      if (subscription.keys === null) {
        throw new httpErrors.InternalServerError(`invalid PushSubscription for ${receiverId}: ${subscription.id} has no keys`)
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
    const failedSubscriptions: typeof subscriptions = []
    const subscriptionPromises = subscriptions.map(subscription => new Promise<void>(async (resolve) => {
      try {
        await sendNotification(subscription, notification)
      } catch (err) {
        if (errHasStatusCode(err) && err.statusCode === 410) {
          // This will happen if the subscription details have been revoked or are expired. Remove the subscription so
          // we don't try to call it in the future.
          failedSubscriptions.push(subscription)
        } else {
          console.error(err)
        }
      }
      resolve()
    }))
    if (failedSubscriptions.length > 0) {
      await prisma.receiver.deleteMany({
        where: {
          OR: failedSubscriptions.map(s => ({ id: s.id }))
        }
      })
    }
    return Promise.all(subscriptionPromises)
  }

  static async sendMessage (receiverId: string, from: string, content?: string) {
    // const message = await prisma.pushMessage.create({
    //   data: {
    //     receiverId,
    //     from,
    //     content
    //   },
    //   include: {
    //     receiver: true
    //   }
    // })

    const receiver = await prisma.receiver.findUnique({ where: { id: receiverId }})
    if (!receiver) {
      throw new Error("Unable to find receiver")
    }

    await ReceiverService.notifyReceiver(receiverId, {
      title: `[${receiver.name}] ${from} thought of you`,
      options: {
        body: content,
        icon: "/heart-icon.png",
        badge: "/heart-icon.png"
      }
    })
  }

  static verifySecret (secret: string, salt: string, targetHash: string): boolean {
    return hashSecret(secret, salt) === targetHash
  }
}
