import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import { register } from './usersThunks';
import { RegisterMutation } from '../../types';
const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);
  const [state, setState] = useState<RegisterMutation>({
    username: '',
    displayName: '',
    password: ''
  });

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message; //message будем выводить
    } catch {
      return undefined;
    }
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState(prevState => {
      return {...prevState, [name]: value};
    });
  };
  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(register(state)).unwrap();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                autoComplete="new-username"
                value={state.username}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('username'))}
                helperText={getFieldError('username')}
              />
            </Grid> <Grid item xs={12}>
            <TextField
              label="DisplayName"
              name="displayName"
              autoComplete="new-displayName"
              value={state.displayName}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('displayName'))}
              helperText={getFieldError('displayName')}
            />
          </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={state.password}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        {loading && <CircularProgress />}
      </Box>
    </Container>
  );
}
export default Register;