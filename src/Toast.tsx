import * as React from "react"
import { toast, ToastBar, Toaster } from "react-hot-toast"
import { HiX } from "react-icons/hi"

export default function Toast() {
    return (
        <div>
            <Toaster
                reverseOrder={false}
                position="bottom-left"
                toastOptions={{
                    style: {
                        borderRadius: "8px",
                        background: "#333",
                        color: "#fff",
                    },
                }}>
                {t => (
                    <ToastBar toast={t}>
                        {({ icon, message }) => (
                            <>
                                {icon}
                                {message}
                            </>
                        )}
                    </ToastBar>
                )}
            </Toaster>
        </div>
    )
}
