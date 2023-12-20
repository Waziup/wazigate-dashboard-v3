import { AddCircleOutline } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
interface AddTextProps{
    text:string
    placeholder:string
    textInputValue?:string
    onTextInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
    name?:string
}

export default function AddTextShow({text,name, placeholder,onTextInputChange,textInputValue}:AddTextProps){
    return (
        <Box sx={{my:2}}>
            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center', borderBottom:'1px solid #ccc'}}>
                <input required name={name} value={textInputValue} onChange={onTextInputChange} placeholder={text} style={{border:'none',color:'#757474',fontWeight:200, outline:'none',width:'100%',padding:'6px 0'}} />
                <AddCircleOutline sx={{color:'#292F3F', fontSize:20}} />
            </Box>
            <Typography fontSize={10} my={.5} color={'#292F3F'} fontWeight={200}>{placeholder}</Typography>
        </Box>
    )
}