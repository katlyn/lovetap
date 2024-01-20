<script setup lang="ts">
import type { ReceiverT } from "api-types/structures"
import { onMounted, ref } from "vue"

import api from "@/config/api"
import router from "@/router"

const props = defineProps<{
  id: string
}>()

const receiver = ref<ReceiverT|null>(null)
const keys = ref<{ pushSecret?: string, editSecret?: string }>(JSON.parse(localStorage.getItem(`receiver-keys:${props.id}`) ?? "{}"))
const previousName = ref<string|null>(localStorage.getItem(`receiver-from:${props.id}`))
const error = ref<string|null>(null)

onMounted(async () => {
  try {
    receiver.value = await api.receiver.getReceiver(props.id)
    localStorage.setItem(`receiver-keys:${props.id}`, JSON.stringify({
      ...keys.value,
      ...receiver.value
    }))
  } catch (err: any) {
    error.value = err.message ?? err.toString()
    if (err.statusCode === 404) {
      localStorage.removeItem(`receiver-keys:${props.id}`)
      localStorage.removeItem(`receiver-from:${props.id}`)
      await router.push("/")
    }
  }
})

async function poke ({ from }: { from: string }) {
  localStorage.setItem(`receiver-from:${props.id}`, from)
  await api.receiver.sendMessage(props.id, keys.value.pushSecret!, { from })
}

async function updateName ({ name }: { name: string }) {
  const response = await api.receiver.updateReceiver(props.id, keys.value.editSecret!, { name })
  localStorage.setItem(`receiver-keys:${props.id}`, JSON.stringify({
    ...keys.value,
    ...response
  }))
  receiver.value = response
}

async function deleteReceiver () {
  await api.receiver.deleteReceiver(props.id, keys.value.editSecret!)
  localStorage.removeItem(`receiver-keys:${props.id}`)
  localStorage.removeItem(`receiver-from:${props.id}`)
  await router.push("/")
}

function copyInvite () {
  navigator.clipboard.writeText(`inv:${props.id}:${keys.value.pushSecret}`)
}

function copyTransfer () {
  navigator.clipboard.writeText(`trans:${props.id}:${keys.value.pushSecret}:${keys.value.editSecret}`)
}
</script>

<template>
  <main>
    <h2>{{ receiver?.name ?? id }}</h2>
    <div v-if="error" class="border-red-500 border bg-red-100 rounded mb-4 p-2">
      Unable to load receiver: {{ error }}.
    </div>
    <div v-else-if="receiver !== null">
      <template v-if="keys.pushSecret">
        <FormKit
          type="form"
          @submit="poke"
          :actions="false"
          :value="{ from: previousName }"
        >
          <h3>Send notification</h3>
          <div>
            <FormKit
              type="text"
              name="from"
              placeholder="Taps will be displayed as from this name"
              validation="required"
            />
            <FormKit
              type="submit"
              label="Send tap!"
            />
          </div>
        </FormKit>
        <FormKit
          type="button"
          label="Copy invite code"
          @click="copyInvite"
        />
      </template>
      <template v-if="keys.editSecret">
        <FormKit
          type="form"
          submit-label="Save"
          @submit="updateName"
          :value="{ name: receiver!.name }"
        >
          <h3>Update receiver</h3>
          <FormKit
            type="text"
            label="Name"
            validation="required"
            name="name"
          />
        </FormKit>
        <FormKit
          type="button"
          label="Delete receiver"
          @click="deleteReceiver"
        />
        <FormKit
          type="button"
          label="Copy transfer code"
          @click="copyTransfer"
        />
      </template>
    </div>
  </main>
</template>
