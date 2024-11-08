import { MoreVert,  } from '@mui/icons-material';
import { Box, Menu,Icon, MenuItem, ListItemIcon } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React from 'react'
interface Props{
    open:boolean
    menuItems:({icon:string,text:string,clickHandler:()=>void} |null)[] 
}
export default function MenuComponent({open,menuItems}:Props) {
    return (
        <Box position={'relative'}>
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                        <MoreVert 
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined} 
                            aria-controls={open ? 'demo-positioned-menu' : undefined} 
                            {...bindTrigger(popupState)} 
                            sx={{ color: 'black',cursor:'pointer' }} 
                        />
                        <Menu {...bindMenu(popupState)}>
                            {
                                menuItems.map((item,id)=> item&&(
                                    <MenuItem key={id} onClick={()=>{popupState.close; item?.clickHandler()}}>
                                        <ListItemIcon>
                                            <Icon fontSize='small'>{item?.icon}</Icon>
                                        </ListItemIcon>
                                        {item?.text}
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </React.Fragment>
                )}
            </PopupState>
        </Box>
    )
}
