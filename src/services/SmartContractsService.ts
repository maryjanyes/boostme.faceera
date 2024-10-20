import Web3 from "web3"

import BoostMeABI from "../abis/ABI.json"
import { SMART_CONTRACT_CORE_ADDRESS } from "../constants"

class SmartContractsService {
    getProvider() {
        if (window.ethereum) {
            return new Web3(window.ethereum);
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    instanceContract() {
        const provider = this.getProvider()

        if (!provider) {
            return
        }
    
        const instance = new provider.eth.Contract(BoostMeABI.abi, SMART_CONTRACT_CORE_ADDRESS)

        return instance
    }

    async callContract(sender: string, method: string, value: string) {
        const contract = this.instanceContract()

        if (!contract) {
            return
        }
    
        try {
            const response = await contract.methods[method]().send({
                from: sender,
                ...(!!value && { value })
            })
            console.log('tx success', response)
        } catch (e) {
            console.log('tx error', e)
        }
    }
}

export default new SmartContractsService()
