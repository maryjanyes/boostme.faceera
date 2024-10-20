<script setup lang="ts">
  import Card from 'primevue/card'

  defineProps<{
    profileData?: {
      role: 'investor' | 'creator',
      address: string,
      investedValue: number,
      // for creators
      totalInvestCup: number,
      investors: string[],
      // for investors
      investedIn: string[],
    }
  }>()
</script>

<template>
  <div v-if="profileData.role === 'creator'" class="min-height-300">
    <h2 class="featured-title-text h2">Creator Profile</h2>
    <h3 class="featured-title-text">Investors</h3>
    <div class="flex">
      <Card v-for="investor in profileData.investors" :key="investor">
        <template #title>
          <p>{{ investor }}</p>
        </template>
        <template #content>
          <p>Address: {{ investor }}</p>
          <p>Invested value: x{{ 0 }}</p>
        </template>
      </Card>
    </div>
  </div>
  <div v-if="profileData.role === 'investor'" class="min-height-300">
    <h2 class="featured-title-text h2">Investor Profile</h2>
    <div class="flex">
      <Card v-for="investedIn in profileData.investedIn" :key="investedIn">
        <p>Address: {{ investedIn }}</p>
        <p>Invested value: x{{ 0 }}</p>
      </Card>
    </div>
  </div>
</template>

<style>
  .min-height-300 {
    min-height: 300px;
  }
</style>
