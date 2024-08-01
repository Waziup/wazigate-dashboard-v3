import { Button,Typography,Icon, ButtonOwnProps, SxProps, Theme } from '@mui/material';
interface Props{
    title:string;
    iconname:string;
    fontSize?:number;
    type?:'submit'|'button'
    onClick?:()=>void;
    hideText?:boolean
    disabled?:boolean
    additionStyles?:SxProps<Theme>,
    color?: ButtonOwnProps["color"]
}
export default function PrimaryIconButton({title,color,disabled,iconname,fontSize,hideText,additionStyles, type, onClick}:Props) {
    return (
        <>
            {
                hideText? (
                    <Button sx={{mx:.4}} startIcon={<Icon onClick={onClick} sx={{ color: '#fff', }} >{iconname}</Icon>}/>
                ):(
                    <Button disabled={disabled?disabled:false} type={type} startIcon={<Icon sx={{fontSize: 16, color: '#fff' }} >{iconname}</Icon>} sx={{mx:1, ...additionStyles}} onClick={onClick} color={color?color:"info"} variant={'contained'} >
                        <Typography color={'#fff'} fontSize={fontSize?fontSize:14}  fontWeight={300}>{title}</Typography>
                    </Button>
                )
            }
        </>
    )
}
