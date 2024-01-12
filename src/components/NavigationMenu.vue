<script setup>
import {routes} from "../vue/router.js";

const items = routes.filter(route => route.meta?.showNav);
</script>
<template>
  <details>
    <summary>Navigation</summary>
    <nav>
      <ul>
        <li v-for="{path} in items" :key="path">
          <router-link :to="path">
            {{ path.slice(1) }}
          </router-link>
        </li>
      </ul>
    </nav>
  </details>
</template>
<style scoped>
details {
  border-bottom: 1px solid grey;
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  padding: 0 20px;
}
</style>
