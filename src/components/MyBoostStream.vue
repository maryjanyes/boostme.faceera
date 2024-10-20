<script setup lang="ts">
  import { ref } from "vue"
  import { useMetaMaskWallet } from "vue-connect-wallet"
  import Stepper from "primevue/stepper"
  import StepList from "primevue/steplist"
  import StepPanels from "primevue/steppanels"
  import Step from "primevue/step"
  import StepPanel from "primevue/steppanel"
  import Panel from "primevue/panel"
  import UserOnboardingForm from "./UserOnboardingForm.vue"
  import Card from "primevue/card"
  import { BACKEND_DOMAIN_URL } from '../constants'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Stream = {
    streamingUrl: string,
    watchUrl: string
  }

  const streamState = ref(null)
  const userRoleSelected = ref(null)
  const streams = ref(null)
  const creatorAddress = ref(null)
  const walletAddress = ref(null)
  const wallet = useMetaMaskWallet()

  const getConnectedAddress = async () => {
    const accounts = await wallet.getAccounts()

    if (typeof accounts === "string") return ""

    walletAddress.value = accounts[0]
  }
  
  const fetchAllStreams = async () => {
    try {
      const streamsResponse = await fetch(`${BACKEND_DOMAIN_URL}/streams`)
      const streamsResponseData = await streamsResponse.json()

      streams.value = streamsResponseData?.data
        .filter((str) => str.playbackId)
        .map((str) => `https://lvpr.tv?v=${str.playbackId}`).slice(0, 5)
    } catch (e) {
      streams.value = []
    }
  }

  const onDoInvest = () => {
    // TODO: open invest modal
    alert('coming soon!')
  }

  const onCompletionStep = async (activateCallback) => {
    if (userRoleSelected.value === "investor") {
      activateCallback("1")
      return
    } else {
      await fetch(`${BACKEND_DOMAIN_URL}/end-stream`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          streamId: streamState.value?.streamId,
        }),
      })
  
      activateCallback("2")
    }
  }

  const onOnboardingDone = (activateCallback, nftAddress: string) => {
    creatorAddress.value = nftAddress
  
    activateCallback("2")
  }

  const onStreamStep = async (activateCallback, watchUrl) => {
    if (userRoleSelected.value == "investor") {
      streamState.value = {
        watchUrl
      }
      activateCallback("2")
      return
    }

    const streamResponseBody = await onStartStream()
    streamState.value = streamResponseBody
    activateCallback("3")
  }

  const onStartStream = async () => {
    const streamResponse = await fetch(`${BACKEND_DOMAIN_URL}/start-stream`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        creatorWallet: "0x",
      }),
    })

    return (await streamResponse.json())
  }

  const onSelectRole = (role: 'creator' | 'investor') => {
    userRoleSelected.value = role
  }

  fetchAllStreams()
  getConnectedAddress()
</script>

<template>
  <div>
    <h2 class="featured-title-text h2">Onboarding & Streams</h2>
    <Stepper v-if="userRoleSelected !== 'investor'" value="1">
      <StepList>
        <Step value="1">Start Onboarding</Step>
        <Step value="2">Start Stream</Step>
        <Step value="3">Streaming</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
              <div class="flex" style="min-width: 600px;">
                  <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                    <UserOnboardingForm
                      :onRoleSelected="(role) => onSelectRole(role)"
                      :onUserOnboarded="(addr) => onOnboardingDone(activateCallback, addr)"
                    />
                  </div>
              </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
              <div class="flex" v-if="!!creatorAddress" style="min-width: 600px;">
                  <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                    <Panel>
                      <p class="paragraph">
                        By entering a stream room you accepting terms of investment and censorship.
                      </p>
                      <p class="paragraph">
                        <span>Your creator address is {{ creatorAddress }}</span>
                        <hr />
                        <span>Your address is {{ walletAddress }}</span>
                      </p>
                    </Panel>
                  </div>
              </div>
              <div class="flex mt-6" v-if="!!creatorAddress">
                <Button
                  label="Start stream"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  @click="() => onStreamStep(activateCallback)"
                />
              </div>
        </StepPanel>
        <StepPanel value="3" v-slot="{ activateCallback }">
              <div class="flex column" v-if="streamState?.streamingUrl" style="min-width: 600px;">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                  <iframe :src="streamState?.streamingUrl" allow="camera; microphone" style="width: 100%; min-height: 30vh;" />
                </div>
                <p>Watch by using url: {{ streamState?.watchUrl }}</p>
              </div>
              <div class="flex mt-6" v-if="streamState?.streamingUrl">
                <Button label="Exit stream" icon="pi pi-arrow-right" iconPos="right" @click="() => onCompletionStep(activateCallback)" />
              </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
    <Stepper v-if="userRoleSelected == 'investor'" value="1">
      <StepList>
        <Step value="1">Select Stream from Creator</Step>
        <Step value="2">Streaming</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div v-if="streams" class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
              <div class="flex gap-2" style="min-width: 600px;">
                <Card v-for="stream in streams" :key="stream">
                        <template #title>
                          <span style="font-size: 12px;">{{ stream }}</span>
                        </template>
                        <template #content>
                          <Button
                            label="Watch stream"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            severity="warn"
                            rounded
                            size="small"
                            @click="() => onStreamStep(activateCallback, stream)"
                          />
                        </template>
                </Card>
              </div>
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="flex column" style="min-width: 600px;">
              <div v-if="streamState?.watchUrl" class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                <iframe :src="streamState.watchUrl" allow="camera; microphone" style="width: 100%; min-height: 30vh;" />
              </div>
                  <div class="flex mt-6 gap-2" v-if="streamState?.watchUrl">
                      <Button
                        label="Exit stream"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="() => onCompletionStep(activateCallback)"
                      />
                      <Button
                        label="Invest in"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="onDoInvest"
                      />
                    </div>
              </div>
          </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
