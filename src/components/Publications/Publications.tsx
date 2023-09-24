import { AnyPublication } from "@lens-protocol/react-web"
import { LensPublication } from "../Lens"

type Props = {
    publications: AnyPublication[]
    imageUrl: string
    lensHandle: string
}

export default function Publications({
    publications,
    imageUrl,
    lensHandle,
}: Props) {
    return (
        <div>
            {publications.map((publication, index) => (
                <div key={index} className="py-4">
                    <LensPublication
                        content={
                            //@ts-ignore
                            publication.metadata.content
                        }
                        imageUrl={imageUrl}
                        lensHandle={lensHandle}
                    />
                </div>
            ))}
        </div>
    )
}
