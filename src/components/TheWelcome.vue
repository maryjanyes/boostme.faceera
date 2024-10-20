<script setup lang="ts">
  import { ref } from 'vue'
  import MyBoostStream from './MyBoostStream.vue'
  import MySelfInvestmentProfile from './MyInvestmentProfile.vue'

  const userProfileData = ref({})
</script>

<template>
  <div class="flex column all-height">
    <MyBoostStream :role="userProfileData.role" :address="userProfileData.address" />
    <MySelfInvestmentProfile :profileData="userProfileData" />
  </div>
</template>
