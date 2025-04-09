<template>
  <div class="max-w-7xl mx-auto p-3 text-center">
    <div class="mb-10 mt-4">
      <img :src="logo" alt="CUBITTS Logo" class="max-w-[200px] h-auto mx-auto" />
    </div>
    <h2 class="text-3xl font-extralight text-gray-800 mb-2">Book an eye test</h2>
    <h2 class="text-md font-light text-gray-600 mb-8">Select a Cubitts store</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12">
      <div
        v-for="branch in branchList"
        :key="branch.name"
        class="border border-gray-200 rounded-md overflow-hidden cursor-pointer bg-stone-50"
        @click="selectBranch(branch)"
      >
        <img
          :src="getImagePath(branch.image)"
          :alt="branch.name"
          class="w-full h-[180px] object-cover"
        />
        <div class="text-xl font-light mt-2 px-4">{{ branch.name }}</div>
        <div class="text-sm px-4 mb-4 font-light text-gray-600">{{ branch.address }}, {{ branch.postcode }}</div>
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
