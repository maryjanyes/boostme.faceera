<script setup lang="ts">
    import { ref } from "vue"
    import { useMetaMaskWallet } from "vue-connect-wallet"

    const address = ref("")
    const wallet = useMetaMaskWallet()

    const connect = async () => {
        const accounts = await wallet.connect()

        if (typeof accounts === "string") {
            console.log("An error occurred" + accounts)
        }
    
        address.value = accounts[0]
    }

    const switchAccount = async () => {
        await wallet.switchAccounts()
    
        connect()
    }

    const isConnected = async () => {
        const accounts = await wallet.getAccounts()

        if (typeof accounts === "string") return false

        return accounts.length > 0
    }
</script>

<template>
    <div class="flex">
        <div v-if="isConnected()" style="margin-right: 5px;">
            <Button rounded raised label="Info" severity="info" @click="switchAccount">
                Reconnect
            </Button>
        </div>
    
        <ConnectWalletButton
            :address="address"
            :txnCount="0"
            :dark="false"
        >
            Connect Wallet (0)

            <template #pending>
                <p>...</p>
            </template>

            <template #connectWalletButton>
                <Button rounded raised label="Info" severity="info" @click="connect">
                    Connect Wallet
                </Button>
            </template>
        </ConnectWalletButton>
    </div>
</template>
