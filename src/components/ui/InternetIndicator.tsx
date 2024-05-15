import * as React from "react";
import {CheckCircle, ErrorOutline} from '@mui/icons-material';
import {internet} from '../../utils/systemapi';
import { Box,CircularProgress, Typography } from "@mui/material";
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
				setTimeout(() => {
					checkTheStatus();
				}, 15000); // Check every 15 seconds
			},
			error => {
				console.log(error);
				setState({
					status: null,
					error: error
				});

				if (oneCallOnly) return;
				setTimeout(() => {
					checkTheStatus();
				}, 15000); // Check every 15 seconds
			}
		);
	}
    return (
        <>
            {
                (state.error)?(
                    <Box style={{color:'#fff', margin: 0 }}>
                        Error <ErrorOutline sx={{color:'#FA9E0E'}}/>
                    </Box>
                ): state.status===null?(
                    <Typography sx={{ margin: 0,color:'#fff' }}>
                        Internet <CircularProgress size={14} sx={{color:'#2BBBAD',mx:1.5,fontSize:14}} />
                    </Typography>
                ):(
                    <Box sx={{display:'flex',color:'#fff', alignItems:'center', justifyContent:'center', flexDirection:'row'}}
                        onClick={() => checkTheStatus(true)}
                    >
                        Internet{" "}
                        {state.status ? (
                            <CheckCircle sx={{mx:1.5,fontSize:14,color:'#2BBBAD'}}/>
                        ) : (
                            <ErrorOutline sx={{mx:1.5,fontSize: 14,color: '#FA9E0E'}}/>
                        )}
                    </Box>
                )
            }
        </>
    );
}