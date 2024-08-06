import { Button, ButtonOwnProps, SxProps, Theme, Typography, } from '@mui/material';
interface Props{
    title:string;
    onClick?:()=>void;
    type?:'submit'|'button'
    disabled?: boolean
    additionStyles?:SxProps<Theme>,
    color?: ButtonOwnProps["color"]
}
export default function PrimaryButton({title,type,disabled,additionStyles,color, onClick}:Props) {
    return (
        <Button type={type} disabled={disabled?disabled: false} sx={{mx:1,...additionStyles}} onClick={onClick} color={color?color:"info"} variant={'contained'}>
            <Typography fontSize={16} fontWeight={'700'} color={'#fff'}>{title}</Typography>
        </Button>
    )
}
