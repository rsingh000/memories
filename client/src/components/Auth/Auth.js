import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import Input from './Input';
import useStyles from './styles';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import Icon from './Icon';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const history = useHistory();

    const handleSubmit = (e) => {
      e.preventDefault();

      if(isSignup) {
        dispatch(signup(formData, history))
      } else {
        dispatch(signin(formData, history))
        
      }
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode = () => {
      setIsSignup((prevIsSignup) => !prevIsSignup);
      setShowPassword(false); 
    }

    const googleSuccess = async (res) => {

      const token = res?.credential;
      const result = jwt_decode(token);

      try {
        dispatch({ type: 'AUTH', data: { result, token }});

        history.push('/');
      } catch (error) {
        console.log(error);
      }
    };

    const googleFailure = (error) => {
      console.log(error);
      console.log('Google Sign-in was unsuccessful. Please try again!')
    };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar} >
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" >{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {
              isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange}  half />
                </>
              )
            }
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            { isSignup && (
              <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>
            )}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleOAuthProvider 
            clientId='157305944726-b3gm011oo4moosok453vku7qepaktual.apps.googleusercontent.com'
          >
            <GoogleLogin onSuccess={credentialResponse => {googleSuccess(credentialResponse)}} 
                onError={googleFailure}
                size="large"
                width='100%'
                className={classes.googleButton}
            />
          </GoogleOAuthProvider>
          <Grid container justify="flex-end">
              <Grid item>
                <Button onClick={switchMode}>{ isSignup ? "Already have an account?" : "Don't have an account! Sign up"}</Button>
              </Grid>
          </Grid>
        </form>

      </Paper>

    </Container>
  )
}

export default Auth