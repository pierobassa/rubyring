export const AddRingBodyBuilder = (
    lensHandle: string,
    smartAccountAddress: string,
) => {
    return {
        lens_handle: lensHandle,
        smart_account_address: smartAccountAddress,
    }
}
