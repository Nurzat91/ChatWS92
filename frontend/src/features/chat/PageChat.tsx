import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Grid, List, ListItem, ListItemIcon, TextField, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { Navigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const PageChat = () => {
  const ws = useRef<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<{ text: string }>({
    text: '',
  });
  const user = useAppSelector(selectUser);

  useEffect(() => {
    setIsLoading(false);
    const connect = () => {
      // setTimeout(() => {
      //   ws.current = new WebSocket('ws://localhost:8000/chat');
      //   ws.current.addEventListener('close', () => {
      //     console.log('WebSocket closed.');
      //     connect();
      //   });
      // }, 5000);
    };

    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.addEventListener('close', () => {
      console.log('WebSocket closed.');
      connect();
    });

    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, []);

  if (!user) {
    return <Navigate to="/register" />;
  }

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => ({...prevState, [name]: value}));
  };

  const sendMessage = (e: React.FormEvent) =>{
    e.preventDefault();
    console.log(state);
    if(!ws.current) return

    ws.current.send(JSON.stringify({type: 'SEND_MESSAGE', payload: state.text}));
    setState({text: ''});
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid item container justifyContent="space-between" flexWrap="nowrap" alignItems="center" sx={{ width: '100%' }}>
          <Grid item xs={3} height="700px"   sx={{textAlign: 'center', p: 2, borderRight: '3px solid grey'}}>
            <Typography variant="h5">Online users</Typography>
            <List >
              {user?.status === true && <ListItem sx={{ marginLeft: '30%' }} key={Math.random()}>
                <ListItemIcon sx={{minWidth: '35px' }}>
                  <CheckCircleIcon sx={{ color: 'green' }} />
                </ListItemIcon>
                {user.displayName}
              </ListItem>}
            </List>
          </Grid>
          <Grid item xs={9} sx={{p: 2}} height="700px">
            <Grid height="600px" sx={{overflowY: 'scroll', overflowWrap: 'break-word'}}>
              <Typography variant="h5">Chat room</Typography>
            </Grid>
            <form autoComplete="off" onSubmit={sendMessage}>
              <Grid container direction="row">
                <Grid container item xs={12} alignContent=''>
                  <TextField
                    sx={{ width: '90%'}}
                    label="Message"
                    name="text"
                    value={state.text}
                    onChange={inputChangeHandler}
                    required
                  />
                  <Button type="submit" color="primary" variant="contained" sx={{ml: 1}}>
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PageChat;