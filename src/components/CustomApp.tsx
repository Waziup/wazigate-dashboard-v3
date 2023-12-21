import { Terminal, MoreVert } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../constants";
import { NormalText } from "../pages/Dashboard";
import { GridItem } from "../pages/Apps";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Button, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Settings } from "@mui/icons-material";
import React from "react";
import { App } from "waziup";
export default function CustomApp({open,app}:{open?:boolean,app:App}){
    return(
        <GridItem>
            <Box px={.4} display={'flex'} alignItems={'center'} sx={{position:'absolute',top:-5,my:-1,}} borderRadius={1} mx={1} bgcolor={DEFAULT_COLORS.orange}>
                <Terminal />
                <Typography  mx={1} color={'white'} component={'span'}>Custom App</Typography>
            </Box>
            <Box display={'flex'} py={2}  justifyContent={'space-between'}>
                <Box>
                    <NormalText title="Waziup App" />
                    <Typography color={DEFAULT_COLORS.navbar_dark} fontWeight={300}>wazigate-edge</Typography>
                </Box>
                <Box position={'relative'}>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button id="demo-positioned-button"
                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    // onClick={handleClick}
                                    {...bindTrigger(popupState)}
                                    >
                                    <MoreVert sx={{color:'black'}}/>
                                </Button>
                                
                                <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={(e)=>{console.log(e.currentTarget.value);popupState.close}} value={app.id} >
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>
                </Box>
                {/* <MoreVert sx={{color:'#292F3F'}}/> */}
            </Box>
            <Typography color={DEFAULT_COLORS.secondary_black}>Status: <span color='red'>Running</span></Typography>
            <Typography color={DEFAULT_COLORS.secondary_black}>Waziup firmware for Edge Computing</Typography>
            
        </GridItem>
    )
}