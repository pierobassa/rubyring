"use client"
import { useCallback, useState } from "react"

export const useDialog = () => {
    const [isOpen, setIsOpen] = useState(false)

    const closeModal = useCallback(() => {
        setIsOpen(false)
    }, [])

    const openModal = useCallback(() => {
        setIsOpen(true)
    }, [])

    return {
        isOpen,
        setIsOpen,
        closeModal,
        openModal,
    }
}
