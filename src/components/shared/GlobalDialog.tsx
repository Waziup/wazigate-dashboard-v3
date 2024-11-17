import { Dialog, DialogTitle, DialogContent, DialogContentText,DialogActions, Button } from '@mui/material';

import { DEFAULT_COLORS } from '../../constants';

interface Props{
    open: boolean,
    title: string,
    acceptBtnTitle: string
    content: string,
    onAccept:()=>void,
    onCancel:()=>void,
}
export default function GlobalDialog({open,title,acceptBtnTitle,content,onAccept,onCancel}:Props) {
    const handleAccept = () => {
        onAccept()
        onCancel()// Close dialog after accept
    };
    
    const handleCancel = () => {
        onCancel();
    };
    return (
        <Dialog fullWidth open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{my:2,}} >
                <DialogContentText sx={{my:1}}>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} sx={{ mx: 2, color: '#ff0000', }} variant="text" color="warning">CANCEL</Button>
                <Button autoFocus onClick={handleAccept} sx={{ mx: 2, color: DEFAULT_COLORS.primary_blue, }} type='submit' variant="text" color="success" >{acceptBtnTitle}</Button>
            </DialogActions>
        </Dialog>
    )
}
