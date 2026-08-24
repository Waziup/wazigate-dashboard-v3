interface Props {
    src: string
    style?: React.CSSProperties
}
export default function SVGIcon({src, style}: Props) {
    return (
        <svg style={style}>
            <use xlinkHref={src}></use>
        </svg>
    )
}