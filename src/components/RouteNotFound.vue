<template>
  <template v-if="$route.path !== '/'">
    <h1>Routing failure</h1>
    <p>
      Route <code>{{ $route.path }}</code> not found!
    </p>
  </template>
</template>
