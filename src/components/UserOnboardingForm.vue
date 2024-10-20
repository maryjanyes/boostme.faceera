<script setup lang="ts">
  import { ref } from 'vue'
  import InputText from 'primevue/inputtext'
  import Panel from 'primevue/panel'
  import IftaLabel from 'primevue/iftalabel'
  import Select from 'primevue/select'

  const onboardingState = ref({
    alias: '',
    maxInvestorsCount: '5',
    maxTokensCup: '1000000',
  })
  const userRoles = ref([
    { name: 'Creator', code: 'creator' },
    { name: 'Investor', code: 'investor' },
  ])
  const userRoleSelected = ref(null)

  const props = defineProps<{
    onUserOnboarded: (addr: string) => void,
    onRoleSelected: (role: string) => void,
  }>()

  const handleOnboarding = async () => {
    // TODO: Done onboarding
    const creatorNFTAddress = "0x000000034"

    props.onUserOnboarded(creatorNFTAddress)
  }
</script>

<template>
  <div class="flex column onboarding-form">
    <Panel>
        <div class="flex column">
          <IftaLabel>
            <Select
              v-model="userRoleSelected"
              :options="userRoles"
              @change="(e) => onRoleSelected(e.value.code)"
              optionLabel="name"
              placeholder="Role"
              id="role"
              class="w-204"
            />
            <label for="role">Role</label>
          </IftaLabel>
          <div class="flex gap-2">
            <IftaLabel>
              <InputText id="alias" type="text" v-model="onboardingState.alias" variant="filled" placeholder="Alias" />
              <label for="alias">Alias</label>
            </IftaLabel>
            <IftaLabel>
              <InputText id="maxInvestorsCount" type="number" v-model="onboardingState.maxInvestorsCount" variant="filled" placeholder="Max investors count" />
              <label for="maxInvestorsCount">Max investors count</label>
            </IftaLabel>
            <IftaLabel>
              <InputText type="number" v-model="onboardingState.maxTokensCup" variant="filled" placeholder="Max tokens cup" />
              <label for="maxTokensCup">Max tokens cup</label>
            </IftaLabel>
          </div>
        </div>
    </Panel>
    <div class="mt-6">
      <Button
        :disabled="!onboardingState.alias || !onboardingState.maxInvestorsCount || !onboardingState.maxTokensCup"
        label="Onboard"
        icon="pi pi-arrow-right"
        iconPos="right"
        rounded
        @click="handleOnboarding"
      />
    </div>
  </div>
</template>
