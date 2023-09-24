type Props = {
    height?: number
    width?: number
}

export const BaseSpacer = ({ height = 0, width = 0 }: Props) => {
    return (
        <div
            style={{
                height: `${height}px`,
                width: `${width}px`,
            }}
        />
    )
}
