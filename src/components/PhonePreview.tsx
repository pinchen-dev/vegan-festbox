import { CaseColor } from "@prisma/client"
import { AspectRatio } from "./ui/aspect-ratio"
import { useRef, useState } from "react"

const PhonePreview = ({
    croppedImageUrl,
    color,
}: {
    croppedImageUrl: string
    color: CaseColor
}) => {
    const ref = useRef<HTMLDivElement>(null)


    const [renderedDimensions, setRenderedDimension] = useState({
        height: 0,
        width: 0,
    })

    return (
    <AspectRatio
    ref= {ref}
    ratio={3000 / 2001}
    className="relative" >
        <div className="absolute z-20 scale-[1.0352]" style={{
            left: renderedDimensions.width / 2 
        }}></div>
    </AspectRatio>
    )
}

export default PhonePreview