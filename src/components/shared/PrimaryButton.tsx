import { Button, ButtonOwnProps, SxProps, Theme, Typography, } from '@mui/material';
interface Props{
    title:string;
    onClick?:()=>void;
    type?:'submit'|'button'
    disabled?: boolean
    additionStyles?:SxProps<Theme>,
    color?: ButtonOwnProps["color"],
    textColor?: string,
    variant?: "text" | "contained" | "outlined"
}
export default function PrimaryButton({title,type,disabled,additionStyles,color,variant,textColor, onClick}:Props) {
    return (
        <Button type={type} disabled={disabled?disabled: false} sx={{mx:1,...additionStyles}} onClick={onClick} disableElevation color={color?color:"info"} variant={variant?variant:'contained'}>
            <Typography fontSize={16} color={textColor?textColor:'#fff'}>{title}</Typography>
        </Button>
    )
}
