export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const ADD_RING_DATA_ENDPOINT = `${BACKEND_URL}/ring`

export const GET_RING_DATA_ENDPOINT = (lensHandle: string) => {
    return `${BACKEND_URL}/ring/${lensHandle}`
}
