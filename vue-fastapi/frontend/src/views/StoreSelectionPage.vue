<template>
  <div class="selection-page">
    <div class="logo-container">
      <img :src="logo" alt="CUBITTS Logo" class="logo-image" />
    </div>
    <h2 class="text-2xl font-bold text-gray-200 mb-8">Book an eye test</h2>
    <div class="branch-selection-container">
      <div
        v-for="branch in branchList"
        :key="branch.name"
        class="branch-card"
        @click="selectBranch(branch)"
      >
        <img
          :src="getImagePath(branch.image)"
          :alt="branch.name"
          class="branch-image"
        />
        <div class="branch-name">{{ branch.name }}</div>
        <div class="branch-address">{{ branch.address }}</div>
        <div class="branch-postcode">{{ branch.postcode }}</div>
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

<style scoped>
.selection-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo-container {
  margin-bottom: 1.5rem;
}

.logo-image {
  max-width: 200px;
  height: auto;
}

.branch-selection-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.branch-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background-color: white;
}

.branch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.branch-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.branch-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  padding: 0 1rem;
}

.branch-address, .branch-postcode {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.branch-postcode {
  margin-bottom: 1rem;
  font-weight: 500;
}
</style>