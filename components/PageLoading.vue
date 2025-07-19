<template>
  <div class="page-loading">
    <v-container class="fill-height">
      <v-row 
        class="fill-height"
        align="center" 
        justify="center"
      >
        <v-col 
          cols="12" 
          class="text-center"
        >
          <v-progress-circular
            :size="60"
            :width="6"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <div class="mt-4">
            <h3 class="text-h6 mb-2">{{ title || 'Loading...' }}</h3>
            <p class="text-body-2 text-medium-emphasis">
              {{ description || 'Please wait while we load the content.' }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Loading...',
  description: 'Please wait while we load the content.'
})
</script>

<style scoped>
.page-loading {
  min-height: 400px;
}
</style>