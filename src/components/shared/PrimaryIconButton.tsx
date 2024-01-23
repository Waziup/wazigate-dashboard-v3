import { Button,Typography,Icon } from '@mui/material';
interface Props{
    title:string;
    iconname:string;
    type?:'submit'|'button'
    onClick:()=>void;
}
export default function PrimaryIconButton({title,iconname, type, onClick}:Props) {
    return (
        <Button type={type} startIcon={<Icon sx={{ color: '#fff' }} >{iconname}</Icon>} sx={{mx:1}} onClick={onClick} color="info" variant={'contained'}>
            <Typography fontSize={14} fontWeight={'700'} color={'#fff'}>{title}</Typography>
        </Button>
    )
}
