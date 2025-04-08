<template>
  <div class="max-w-7xl mx-auto p-8 text-center">
    <div class="mb-6">
      <img :src="logo" alt="CUBITTS Logo" class="max-w-[200px] h-auto mx-auto" />
    </div>
    <h2 class="text-2xl font-medium text-gray-600 mb-8">Book an eye test</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
      <div
        v-for="branch in branchList"
        :key="branch.name"
        class="border border-gray-200 rounded-lg overflow-hidden cursor-pointer bg-white"
        @click="selectBranch(branch)"
      >
        <img
          :src="getImagePath(branch.image)"
          :alt="branch.name"
          class="w-full h-[180px] object-cover"
        />
        <div class="text-xl font-medium mt-2 px-4">{{ branch.name }}</div>
        <div class="px-4 mb-4 font-light text-gray-600">{{ branch.address }}, {{ branch.postcode }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'
import storeDetails from '../storeDetails.json'
import logo from '../assets/logo.png'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const branchList = ref([])

    onMounted(() => {
      branchList.value = storeDetails
    })

    const getImagePath = (imageName) => {
      return new URL(`../assets/branches/${imageName}`, import.meta.url).href
    }

    const selectBranch = (branch) => {
      // Store the selected branch in localStorage for use in other components
      localStorage.setItem('selectedBranch', JSON.stringify(branch))
      // Navigate to the booking page
      store.setSelectedBranch(branch)
      router.push('/booking')
    }

    return {
      branchList,
      getImagePath,
      selectBranch,
      logo
    }
  }
}
</script>
