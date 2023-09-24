import React, { forwardRef } from "react"

type Props = {
    title: string
    inputType: string
    placeholder?: string
    error?: string
} & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>

export const InputField = forwardRef<HTMLInputElement, Props>(
    ({ title, inputType, placeholder, error, onChange, ...props }, ref) => {
        return (
            <>
                <div className="flex justify-between">
                    <label
                        htmlFor={props.id}
                        className="block text-sm font-medium leading-6 text-stone-200">
                        {title}
                    </label>
                    <div
                        className="text-[#fe87a2] mt-1 text-sm"
                        style={{ minHeight: "20px" }}>
                        {error}
                    </div>
                </div>
                <div className="mt-2">
                    <input
                        ref={ref}
                        type={inputType}
                        name={props.name}
                        id={props.id}
                        autoComplete={props.autoComplete}
                        className={`py-3 px-4 w-full ${
                            error ? "border-[#fe87a2]" : "border-stone-800"
                        } focus:outline-none focus:border-blue border-2 border-solid rounded-md text-sm  bg-stone-800 focus:border-stone-600 text-stone-200 placeholder:text-gray-400`}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                </div>
            </>
        )
    },
)

InputField.displayName = "InputField"
