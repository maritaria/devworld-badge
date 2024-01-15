<script setup>
import {routes} from "../vue/router.js";
import {computed, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";

const items = routes.filter(route => route.meta?.showNav);

/** @type {import('vue').Ref<null|HTMLDetailsElement>} */
const $details = ref(null);
const $route = useRoute();
watchEffect(() => {
  if ($route.matched.length === 0) {
    const element = $details.value;
    if (element) {
      element.open = true;
    }
  }
});

</script>
<template>
  <details ref="$details">
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
