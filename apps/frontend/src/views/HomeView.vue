<script setup lang="ts">
import type { ReceiverT } from "api-types/dist/structures"
import { onMounted, ref } from "vue"

import api from "@/config/api"
import { requestPermission, subscribe } from "@/notifications"
import router from "@/router"

const error = ref<string|null>(null)
const knownReceivers = ref<ReceiverT[]>([])

onMounted(() => {
  for (let i = 0, len = localStorage.length; i < len; ++i) {
    const key = localStorage.key(i)
    if (!key?.startsWith("receiver-keys:")) {
      continue
    }
    knownReceivers.value.push(JSON.parse(localStorage.getItem(key) as string))
  }
})

async function submit (data: { name: string }) {
  try {
    if (!await requestPermission()) {
      return
    }
    const receiver = await api.receiver.createReceiver(data)
    await subscribe(receiver.id, receiver.editSecret)
    localStorage.setItem(`receiver-keys:${receiver.id}`, JSON.stringify(receiver))
    void router.push({ name: "receiver", params: { id: receiver.id } })
  } catch (err: any) {
    console.error(err)
    error.value = err.message ?? err
  }
}

async function addReceiver ({ code }: {code: string }) {
  const [, id, pushSecret, editSecret ] = code.split(":")
  localStorage.setItem(`receiver-keys:${id}`, JSON.stringify({ id, pushSecret, editSecret }))
  if (editSecret !== undefined) {
    await subscribe(id, editSecret)
  }
  await router.push({ name: "receiver", params: { id } })
}
</script>

<template>
  <main>
    <FormKit
      type="form"
      submit-label="Create receiver"
      @submit="submit"
    >
      <h2>Create receiver</h2>
      <div v-if="error" class="border-red-500 border bg-red-100 rounded mb-4 p-2">
        Unable to create receiver: {{ error }}.
      </div>
      <FormKit
        type="text"
        name="name"
        label="Name"
        placeholder="Name for the created receiver"
        validation="required"
      />
    </FormKit>
    <FormKit
      type="form"
      submit-label="Add existing receiver"
      @submit="addReceiver"
    >
      <h2>Add receiver</h2>
      <FormKit
        type="text"
        label="Receiver code"
        placeholder="Existing receiver invite or transfer code"
        name="code"
        validation="required"
      />
    </FormKit>
    <section v-if="knownReceivers.length > 0">
      <h2>
        Current receivers
      </h2>
      <ul class="list-disc ml-8">
        <li v-for="receiver in knownReceivers" :key="receiver.id">
          <RouterLink :to="{ name: 'receiver', params: { id: receiver.id } }">
            {{ receiver.name }}
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>
