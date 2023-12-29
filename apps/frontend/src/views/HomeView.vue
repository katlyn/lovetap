<script setup lang="ts">
import { ref } from "vue"

import api from "@/config/api"
import router from "@/router"

const error = ref<string|null>(null)

async function submit (data: { name: string }) {
  try {
    const receiver = await api.receiver.createReceiver(data)
    void router.push({ name: "receiver", params: { id: receiver.id } })
  } catch (err: any) {
    error.value = err.message ?? err
  }
}
</script>

<template>
  <main>
    <FormKit
      type="form"
      submit-label="Create receiver"
      @submit="submit"
    >
      <div v-if="error" class="border-red-500 border bg-red-100 rounded mb-4 p-2">
        Unable to create receiver: {{ error }}.
      </div>
      <FormKit
        type="text"
        name="name"
        validation="required"
      />
    </FormKit>
  </main>
</template>
