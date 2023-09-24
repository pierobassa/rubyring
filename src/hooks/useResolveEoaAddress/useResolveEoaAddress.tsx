import { RubyRingAPI } from "@/networking"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"

/**
 * This hook is used to resolve an EOA address from a given lens profile handle
 * @returns {string} The smart contract address of the associated EOA
 *
 */
export const useResolveEoaAddress = (profileHandle: string) => {
    const [smartAccountAddress, setSmartAccountAddress] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getSmartAccountAddress = useCallback(async () => {
        setIsLoading(true)
        try {
            const { data, status } = await axios.get(
                RubyRingAPI.GET_RING_DATA_ENDPOINT(profileHandle),
            )

            if (status !== 200) return //TODO

            console.log(data)

            setSmartAccountAddress(data.data[0].smart_account_address)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [profileHandle])

    // Fetch the smart account address of the given Lens profile
    useEffect(() => {
        if (smartAccountAddress) return

        getSmartAccountAddress()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSmartAccountAddress])

    return { smartAccountAddress, isLoading }
}
