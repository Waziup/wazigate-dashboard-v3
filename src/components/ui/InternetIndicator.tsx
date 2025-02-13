import * as React from "react";
import {internet} from '../../utils/systemapi';
import { Box,CircularProgress, Typography } from "@mui/material";
import { DEFAULT_COLORS } from "../../constants";
export default function InternetIndicator(){
    const [state,setState] = React.useState({
        status: null,
        error: null
    });
    React.useEffect(()=>{
        checkTheStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
	const checkTheStatus = (oneCallOnly: boolean = false)=> {
		setState({
			status: null,
			error: null
		});
		internet().then(
			status => {
				setState({
					status: status,
					error: null
				});
				if (oneCallOnly) return;
				const tmId = setTimeout(() => {
					checkTheStatus();
				}, 15000); // Check every 15 seconds
                return () => clearTimeout(tmId);
			},
			error => {
				setState({
					status: null,
					error: error
				});

				if (oneCallOnly) return;
				const tmId = setTimeout(() => {
					checkTheStatus();
				}, 15000); // Check every 15 seconds
                return () => clearTimeout(tmId);
			}
		);
	}
    return (
        <>
            {
                (state.error)?(
                    <Box style={{color:'#fff', margin: 0 }}>
                        <Typography sx={{fontSize:14, margin: 0,color:'#FA9E0E'}}>
                            Error Encounted
                        </Typography>
                    </Box>
                ): state.status===null?(
                    <Typography sx={{fontSize:14, margin: 0,color:'#fff' }}>
                        <CircularProgress size={14} sx={{color:DEFAULT_COLORS.primary_blue,mx:1.5,fontSize:14}} />
                    </Typography>
                ):(
                    <Box sx={{display:'flex',color:'#fff', }}
                        onClick={() => checkTheStatus(true)}
                    >
                        {state.status ? (
                            <Typography sx={{fontSize:14,  margin: 0,color: DEFAULT_COLORS.primary_blue}}>
                                Connected
                            </Typography>
                        ) : (
                            <Typography sx={{fontSize:14,  margin: 0,color:'#FA9E0E'}}>
                                Disconnected
                            </Typography>
                        )}
                    </Box>
                )
            }
        </>
    );
}