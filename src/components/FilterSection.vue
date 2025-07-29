<script setup lang="ts">
import { ref } from 'vue';

interface FilterCategory {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  categories: FilterCategory[];
  withSearch?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['filter', 'search']);

const currentFilter = ref('all');
const searchInput = ref('');

const setFilter = (filter: string) => {
  currentFilter.value = filter;
  emit('filter', filter);
};

const handleSearch = () => {
  emit('search', searchInput.value);
};
</script>

<template>
  <section class="filter-section">
    <div class="filter-content">
      <div class="filter-buttons">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="filter-btn" 
          :class="{ active: currentFilter === category.id }"
          :data-filter="category.id"
          @click="setFilter(category.id)"
        >
          {{ category.icon }} {{ category.label }}
        </button>
      </div>
      <div v-if="withSearch" class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search..." 
          v-model="searchInput"
          @input="handleSearch"
        >
        <span class="search-icon">🔍</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filter-section {
  background: white;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: var(--bg-light);
  border: 2px solid transparent;
  border-radius: 25px;
  color: var(--text-dark);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover, .filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  background: var(--bg-light);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

@media (max-width: 768px) {
  .filter-content {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
    width: 100%;
  }
}
</style>