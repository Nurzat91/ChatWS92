import { Button, Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';

const AnonumousMenu = () => {
  return (
    <Grid item>
      <Button component={NavLink} to="/register" color="inherit">Sign Up</Button>
      <Button component={NavLink} to="/login" color="inherit">Sign In</Button>
    </Grid>
  );
};

export default AnonumousMenu;