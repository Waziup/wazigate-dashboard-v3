import * as React from "react";
import {CheckCircle, ErrorOutline} from '@mui/icons-material';
import {internet} from '../../utils/systemapi';
import { Box } from "@mui/material";
export default function InternetIndicator(){
    const [state,setState] = React.useState({
        status: null,
        error: null
    });
    React.useEffect(()=>{
        checkTheStatus();
    },[])

	/**------------- */

	const checkTheStatus = (oneCallOnly: boolean = false)=> {
		// console.log(oneCallOnly, "Checking net...");

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

	/**------------- */

    return (
        <>
            {
                (state.error)?(

                    <div className="alert alert-error" style={{ margin: 0 }}>
                        Error <ErrorOutline/>
                    </div>
                ): state.status===null?(
                    <div className="alert alert-primary" style={{ margin: 0 }}>
                        Internet <CheckCircle/>
                        {/* <LoadingSpinner type="grow-sm" class="text-info ml-2 pl-1" /> */}
                    </div>
                ):(
                    <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'row'}}
                        onClick={() => checkTheStatus(true)}
                    >
                        Internet{" "}
                        {state.status ? (
                            <CheckCircle/>
                        ) : (
                            <ErrorOutline/>
                        )}
                    </Box>
                )
            }
        </>
    );
}