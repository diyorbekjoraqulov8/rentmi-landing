<script setup lang="ts">
// Default layout — wraps every page with the site header and footer.
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-neutral-900">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
