import { AddCircleOutline } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";
interface AddTextProps{
    text:string
    placeholder:string
    textInputValue?:string
    onTextInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
    name?:string
}
interface AddTextProps{
    text:string
    isPlusHidden?: boolean
    isReadOnly?: boolean
    placeholder:string
    textInputValue?:string
    onTextInputChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
    name?:string
    autoGenerateHandler?:(title:"devAddr"|"nwkSEncKey"|"appSKey")=>void
}
export default function AddTextShow({text,isReadOnly,name,isPlusHidden,autoGenerateHandler, placeholder,onTextInputChange,textInputValue}:AddTextProps){
    return (
        <Box sx={{my:2}}>
            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center', borderBottom:'1px solid #ccc'}}>
                <input readOnly={isReadOnly} required name={name} value={textInputValue} onChange={onTextInputChange} placeholder={text} style={{border:'none',color: DEFAULT_COLORS.navbar_dark,fontWeight:200, outline:'none',width:'100%',padding:'6px 0'}} />
                {
                    isPlusHidden?null:(
                        <Tooltip onClick={()=> autoGenerateHandler && autoGenerateHandler(name as "devAddr"|"nwkSEncKey"|"appSKey")} title={"AutoGenerate "+name}>
                            <AddCircleOutline sx={{color:'#292F3F', fontSize:20}} />
                        </Tooltip>
                    )
                }
            </Box>
            <Typography fontSize={10} my={.5} color={'#292F3F'} fontWeight={200}>{placeholder}</Typography>
        </Box>
    )
}