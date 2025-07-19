<template>
  <v-overlay 
    v-model="loadingStore.isLoading" 
    class="align-center justify-center"
    persistent
    contained
  >
    <div class="text-center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div class="mt-4">
        <v-chip
          v-if="loadingStore.message"
          color="primary"
          variant="elevated"
          size="small"
        >
          {{ loadingStore.message }}
        </v-chip>
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
const loadingStore = useLoadingStore()
</script>

<style scoped>
.v-overlay {
  z-index: 9999;
}
</style>