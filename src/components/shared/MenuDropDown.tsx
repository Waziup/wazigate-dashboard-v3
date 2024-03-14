import { MoreVert,  } from '@mui/icons-material';
import { Box, Button, Menu,Icon, MenuItem, ListItemIcon } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React from 'react'
interface Props{
    open:boolean
    menuItems:{icon:string,text:string,clickHandler:()=>void}[]
}
export default function MenuComponent({open,menuItems}:Props) {
    return (
        <Box position={'relative'}>
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                        <Button id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            {...bindTrigger(popupState)}
                        >
                            <MoreVert sx={{ color: 'black' }} />
                        </Button>

                        <Menu {...bindMenu(popupState)}>
                            {
                                menuItems.map((item,id)=>(
                                    <MenuItem key={id} onClick={()=>{popupState.close; item.clickHandler()}}>
                                        <ListItemIcon>
                                            <Icon fontSize='small'>{item.icon}</Icon>
                                        </ListItemIcon>
                                        {item.text}
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
