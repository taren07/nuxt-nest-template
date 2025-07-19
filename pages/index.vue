<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-card-title class="text-h4 text-center pa-6">
            Nuxt Nest Template
          </v-card-title>
          
          <v-card-text class="text-center">
            <v-icon size="120" color="primary" class="mb-4">
              mdi-coffee
            </v-icon>
            
            <p class="text-h6 mb-4">
              NestJS + TypeORM + PostgreSQL + Nuxt.js + Vuetify
            </p>
            
            <p class="text-body-1 mb-6">
              CRUDテンプレートアプリケーションへようこそ！
              ユーザー管理機能を試してみてください。
            </p>
            
            <v-btn
              color="primary"
              size="large"
              to="/users"
              prepend-icon="mdi-account-group"
            >
              User Management
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-server</v-icon>
            Backend
          </v-card-title>
          <v-card-text>
            <v-chip class="ma-1" color="green">NestJS</v-chip>
            <v-chip class="ma-1" color="blue">TypeORM</v-chip>
            <v-chip class="ma-1" color="indigo">PostgreSQL</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-web</v-icon>
            Frontend
          </v-card-title>
          <v-card-text>
            <v-chip class="ma-1" color="green">Nuxt.js</v-chip>
            <v-chip class="ma-1" color="blue">Vue.js</v-chip>
            <v-chip class="ma-1" color="purple">Vuetify</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-feature-search</v-icon>
            Features
          </v-card-title>
          <v-card-text>
            <v-chip class="ma-1" color="orange">CRUD API</v-chip>
            <v-chip class="ma-1" color="red">Validation</v-chip>
            <v-chip class="ma-1" color="teal">State Management</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
useHead({
  title: 'Nuxt Nest Template'
})
</script>