import { useMemo } from "react"
import { BsFillCheckCircleFill } from "react-icons/bs"

type Props = {
    title: string
    displayedNumber: number
    done: boolean
    current: boolean
}

export const Breadcrumb = ({
    title,
    displayedNumber,
    done,
    current,
}: Props) => {
    const renderDoneBreadcrumb = useMemo(() => {
        return (
            <div className="text-[#FF89A9] text-sm md:text-base font-medium items-center md:px-8 px-4">
                <div className="justify-center flex pt-1">
                    <BsFillCheckCircleFill />
                </div>
                <div className="pt-0.5">{title}</div>
            </div>
        )
    }, [title])

    const renderNotDoneBreadcrumb = useMemo(() => {
        return (
            <div
                className={`${
                    current ? "text-[#ff89a9]" : "text-stone-300"
                } text-sm md:text-base font-medium items-center md:px-8 px-4`}>
                <div className="text-center h-5">{displayedNumber}</div>
                <div className="pt-0.5">{title}</div>
            </div>
        )
    }, [displayedNumber, title, current])

    return done ? renderDoneBreadcrumb : renderNotDoneBreadcrumb
}
