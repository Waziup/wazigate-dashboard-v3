import { Button,Typography,Icon } from '@mui/material';
interface Props{
    title:string;
    iconname:string;
    fontSize?:number;
    type?:'submit'|'button'
    onClick?:()=>void;
    hideText?:boolean
    disabled?:boolean
}
export default function PrimaryIconButton({title,disabled,iconname,fontSize,hideText, type, onClick}:Props) {
    return (
        <>
            {
                hideText? (
                    <Button color="info" variant={'contained'} sx={{mx:.4}} startIcon={<Icon onClick={onClick} sx={{ color: '#fff', }} >{iconname}</Icon>}/>
                ):(
                    <Button disabled={disabled?disabled:false} type={type} startIcon={<Icon sx={{fontSize: 16, color: '#fff' }} >{iconname}</Icon>} sx={{mx:1}} onClick={onClick} color="info" variant={'contained'}>
                        <Typography color={'#fff'} fontSize={fontSize?fontSize:14}  fontWeight={300}>{title}</Typography>
                    </Button>
                )
            }
        </>
    )
}
