type Props = {
    color: string
}

export const BaseSeparator = ({ color }: Props) => {
    return (
        <div
            style={{
                backgroundColor: color,
                width: "100%",
                height: 1,
            }}
        />
    )
}
