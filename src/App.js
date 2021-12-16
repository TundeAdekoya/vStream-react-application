import React from 'react';
import { Typography,  AppBar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core';

import VideoPlayer from './Components/VideoPlayer';
import Notifications from './Components/Notifications';
import Options from './Components/Options';

const useStyles = makeStyles((theme) => ({
  appBar: {
      borderRadius: 10,
      margin: '30px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },

    typo:{
      fontFamily:'Roboto',
      fontWeight: 900,
      color: '#3F51B5',
    },

      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      },
}));

const App = () => {
  const classes = useStyles( );
  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position='static' color='inherit'>
        <Typography className={classes.typo}  variant='h4' align='center'> Vstream</Typography>
      </AppBar>
      <VideoPlayer/>
      <Options>
          <Notifications/>
      </Options>
    </div>
  )
}

export default App
