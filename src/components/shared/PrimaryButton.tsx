import { Button,Typography, } from '@mui/material';
interface Props{
    title:string;
    onClick?:()=>void;
    type?:'submit'|'button'
}
export default function PrimaryButton({title,type, onClick}:Props) {
    return (
        <Button type={type} sx={{mx:1}} onClick={onClick} color="info" variant={'contained'}>
            <Typography fontSize={16} fontWeight={'700'} color={'#fff'}>{title}</Typography>
        </Button>
    )
}
