import React, { useEffect, useState } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from './Theme';
import TimeCalculator from './components/TimeCalculator';
import WeeklyPlanner from './components/WeeklyPlanner';
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { getCookie } from './utils/Utils';
import TimeBlock from './components/TimeBlock';

function App() {
  const [cookie, setCookie] = useState('');

  useEffect(() => {
    getCookie().then((cookie) => {
      if (!cookie) return;
      setCookie(cookie);
      // console.log("cookie set: " + cookie);
    });
  }, []);

  let theme = createTheme(lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        width="80%"
        margin="0px auto"
        padding="2rem"
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              variant="h1"
              marginBottom={'0.5rem'}
              color="primaryText"
            >
              Welcome, {cookie}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={8}
            lg={9}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <WeeklyPlanner cookie={cookie} />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                lg={4}
              >
                <TimeCalculator />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            lg={3}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <TimeBlock cookie={cookie} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Backdrop
          sx={{
            color: '#000',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            fontSize: '200px',
          }}
          open={cookie === ''}
        >
          <CircularProgress
            sx={{ color: 'white', margin: '0rem 1rem', marginBottom: '2rem' }}
          />
          <Typography
            variant={'h4'}
            color="#fff"
            sx={{ marginBottom: '2rem' }}
          >
            Loading...
          </Typography>
        </Backdrop>
      </Box>
    </ThemeProvider>
  );
}

export default App;
