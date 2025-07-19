<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Nuxt Nest Template</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/users" text>Users</v-btn>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
    
    <!-- Global Loading Overlay -->
    <GlobalLoading />
  </v-app>
</template>

<style scoped>
.v-app {
  max-width: 375px;
  margin: 0 auto;
}
</style>
