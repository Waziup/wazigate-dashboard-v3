import { Alert, Box, Button, FormControl, Input, Snackbar, Typography} from '@mui/material';
  import { DEFAULT_COLORS } from '../constants';
  import { useNavigate } from 'react-router-dom';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useForm, SubmitHandler } from 'react-hook-form';
  import * as yup from 'yup';
  import { useContext, useState } from 'react';
  import { DevicesContext } from '../context/devices.context';
  import Logo from '../assets/wazigate.svg';
  
  interface RegistrationInput {
    username: string;
    password: string;
  }
  
  const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  }).required();
  
  interface TextInputProps {
    children: React.ReactNode;
    label: string;
    mendatory?: boolean;
    id?: string;
  }
  
   export const TextInput = ({ children, label, mendatory }: TextInputProps) => (
    <Box py={1}>
      <Typography variant="body1" sx={{ color: DEFAULT_COLORS.primary_black, fontWeight: 300, display: 'flex', alignItems: 'center' }}>
        {label}
        {mendatory && <Typography component="span" sx={{ color: DEFAULT_COLORS.orange, ml: 0.5 }}>*</Typography>}
      </Typography>
      {children}
    </Box>
  );
  
  export default function Login() {
    const navigate = useNavigate();
    const [showErrSnackbar, setShowErrSnackbar] = useState(false);
    const [errorMess, setErrorMessage] = useState('');
    const { handleSubmit, register } = useForm<RegistrationInput>({
      resolver: yupResolver(schema),
    });
    const { setAccessToken } = useContext(DevicesContext);
  
    const onSubmit: SubmitHandler<RegistrationInput> = async (data) => {
      try {
        window.wazigate.authToken(data.username, data.password)
          .then((res) => {
            setAccessToken(res);
            window.sessionStorage.setItem("creds", JSON.stringify(data));
            window.wazigate.setToken(res);
            navigate('/dashboard', { state: { title: 'Dashboard' } });
          })
          .catch((err) => {
            setErrorMessage(err.message?.includes('fetch') 
              ? 'Check if the backend server is running' 
              : err.toString());
            setShowErrSnackbar(true);
          });
      } catch (error) {
        setErrorMessage((error as Error).message);
        setShowErrSnackbar(true);
      }
    };
  
    const handleClose = () => setShowErrSnackbar(false);
  
    return (
      <Box height="100vh" width="100%" bgcolor="#f6fbff">
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={showErrSnackbar}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {errorMess}
          </Alert>
        </Snackbar>
  
        <Box
          position="absolute"
          sx={{
            transform: 'translate(-50%,-50%)',
            top: '50%',
            left: '50%',
            borderRadius: 2,
            bgcolor: '#fff',
            width: 350,
            p: 3
          }}
        >
          <Box textAlign="center" mb={4}>
            <Box
              component="img"
              src={Logo}
              sx={{ width: '50%', mx: 'auto' }}
              alt="Wazigate Logo"
            />
          </Box>
  
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <TextInput label="Username">
                <Input
                  {...register('username')}
                  fullWidth
                  placeholder="admin"
                  sx={{
                    borderBottom: '1px solid #D5D6D8',
                    '&:before, &:after': { borderBottom: 'none' }
                  }}
                />
              </TextInput>
  
              <TextInput label="Password">
                <Input
                  {...register('password')}
                  type="password"
                  fullWidth
                  placeholder="••••••••"
                  sx={{
                    borderBottom: '1px solid #D5D6D8',
                    '&:before, &:after': { borderBottom: 'none' }
                  }}
                />
              </TextInput>
  
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color='secondary'
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  py: 1.5,
                }}
              >
                LOGIN
              </Button>
            </FormControl>
          </form>
  
          <Box mt={3}>
            <Typography variant="body2" color="textSecondary">Default Username: admin</Typography>
            <Typography variant="body2" color="textSecondary">Default Password: loragateway</Typography>
          </Box>
        </Box>
      </Box>
    );
  }