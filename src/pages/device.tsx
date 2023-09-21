import { ExpandMore, Home, SettingsTwoTone } from "@mui/icons-material";
import { Box, Typography, Button, Chip, emphasize, styled, Breadcrumbs } from "@mui/material";
import { RowContainerBetween } from "./dashboard";
import EnhancedTable from "../components/devicetable";
import { useNavigate } from "react-router-dom";
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  }) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
  
function Device() {
    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    const navigate = useNavigate();
    const handleNav = (path:string)=>{navigate(path)}
    return (
        <Box p={3} sx={{ height:'100%'}}>
            <RowContainerBetween>
                <Box>
                    <Typography fontWeight={700} color={'black'}>Device 1</Typography>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component="a"
                                href="/devices"
                                label="Devices"
                                icon={<Home fontSize="small" />}
                            />
                            <StyledBreadcrumb component="a" href="/device/3" label="Device 1" />
                            <StyledBreadcrumb
                                label="Sensors"
                                deleteIcon={<ExpandMore />}
                                onDelete={handleClick}
                            />
                        </Breadcrumbs>
                    </div>
                </Box>
                <Button onClick={()=>handleNav('/devices/3/setting')} variant={'contained'}>
                    <SettingsTwoTone/>
                    SETTINGS
                </Button>
            </RowContainerBetween>
            <EnhancedTable  />
        </Box>
    );
}

export default Device;