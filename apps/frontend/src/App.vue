<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"

</script>

<template>
  <header>
    <h1 class="text-3xl font-bold">
      Lovetap
    </h1>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
