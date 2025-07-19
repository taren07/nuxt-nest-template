<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="text-h5">User Management</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">
              <v-icon>mdi-plus</v-icon>
              Add User
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <v-data-table
              :headers="userTableHeaders"
              :items="userStore.users"
              :loading="userStore.loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon
                  size="small"
                  class="me-2"
                  @click="editUser(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  size="small"
                  @click="deleteUser(item.id)"
                >
                  mdi-delete
                </v-icon>
              </template>
              
              <template v-slot:item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="350px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingUser ? 'Edit User' : 'New User' }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  v-bind="emailAttrs"
                  label="Email"
                  :error-messages="errors.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  v-bind="nameAttrs"
                  label="Name"
                  :error-messages="errors.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="age"
                  v-bind="ageAttrs"
                  label="Age"
                  type="number"
                  :error-messages="errors.age"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onSubmit"
            :loading="loadingStore.isLoading"
            :disabled="loadingStore.isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alert for errors -->
    <v-alert
      v-if="userStore.error"
      type="error"
      dismissible
      @input="userStore.error = null"
    >
      {{ userStore.error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { userTableHeaders } from '~/constants/tableHeaders'
import { formatDate } from '~/utils/dateFormatter'

const userStore = useUserStore()
const loadingStore = useLoadingStore()

const {
  dialog,
  editingUser,
  email,
  emailAttrs,
  name,
  nameAttrs,
  age,
  ageAttrs,
  errors,
  openCreateDialog,
  editUser,
  closeDialog,
  onSubmit,
  deleteUser
} = useUserForm()

onMounted(async () => {
  try {
    await userStore.fetchUsers()
  } catch (error) {
    console.error('Failed to load users:', error)
  }
})
</script>