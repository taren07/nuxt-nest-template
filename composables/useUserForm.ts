import type { User } from '~/composables/useApi'
import { userSchema } from '~/schemas/userSchema'

export const useUserForm = () => {
  const userStore = useUserStore()
  
  const dialog = ref(false)
  const editingUser = ref<User | null>(null)

  const { defineField, handleSubmit, resetForm, errors } = useForm({
    validationSchema: userSchema
  })

  const [email, emailAttrs] = defineField('email')
  const [name, nameAttrs] = defineField('name')
  const [age, ageAttrs] = defineField('age')

  const openCreateDialog = () => {
    editingUser.value = null
    resetForm()
    dialog.value = true
  }

  const editUser = (user: User) => {
    editingUser.value = user
    email.value = user.email
    name.value = user.name
    age.value = user.age
    dialog.value = true
  }

  const closeDialog = () => {
    dialog.value = false
    editingUser.value = null
    resetForm()
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (editingUser.value) {
        await userStore.updateUser(editingUser.value.id, values)
      } else {
        await userStore.createUser(values)
      }
      closeDialog()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  })

  const deleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await userStore.deleteUser(id)
    }
  }

  return {
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
  }
}