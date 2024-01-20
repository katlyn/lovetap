<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"

</script>

<template>
  <div class="max-w-screen-md mx-auto p-8">
    <header class="flex items-baseline justify-between w-full">
      <h1>
        Lovetap
      </h1>

      <div class="wrapper">
        <nav class="flex gap-2">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>

    <hr class="mb-4">

    <RouterView />
  </div>
</template>
