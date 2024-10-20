<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import ConnectWallet from './components/ConnectWallet.vue'
</script>

<template>
  <div class="site-main">
    <header>
      <img alt="Logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <div class="wrapper">
        <nav>
          <Button rounded raised as="a" label="Home" href="/" />
          <Button rounded raised as="a" label="How it works" href="/about" />
          <ConnectWallet />
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
  .site-main {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 2em;
    padding-left: 2em;

    > header {
      min-width: 30%;
    }
  }

  .wrapper nav > * {
    margin: 0.2em;
  }
</style>
