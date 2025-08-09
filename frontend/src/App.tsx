import { useEffect, useState } from 'react';
import './App.css';
import TimeCalculator from './components/TimeCalculator';
import WeeklyPlanner from './components/WeeklyPlanner';
import { getCookie } from './utils/Utils';
import SchedulePlanner from './components/SchedulePlanner';
import '@mantine/core/styles.css';
import {
  Box,
  Grid,
  MantineProvider,
  Overlay,
  Title,
  Typography,
} from '@mantine/core';
import CircularProgress from '@mui/material/CircularProgress';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

function App() {
  const [cookie, setCookie] = useState('');

  useEffect(() => {
    getCookie().then((cookie) => {
      if (!cookie) return;
      setCookie(cookie);
      // console.log("cookie set: " + cookie);
    });
  }, []);

  return (
    <MantineProvider>
      <Notifications />
      <Box
        display="flex"
        style={{
          flexDirection: 'column',
          width: '90%',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <Grid gutter={20}>
          <Grid.Col span={12}>
            <Title
              order={1}
              style={{ marginBottom: '0.5rem' }}
            >
              Intent: Live Intentionally
            </Title>
          </Grid.Col>

          <Grid.Col span={{ xs: 12, md: 8, lg: 9 }}>
            <Grid gutter={20}>
              <Grid.Col span={12}>
                <WeeklyPlanner cookie={cookie} />
              </Grid.Col>

              <Grid.Col span={{ xs: 12, md: 6, lg: 4 }}>
                <TimeCalculator />
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={{ xs: 12, md: 4, lg: 3 }}>
            <Grid gutter={20}>
              <Grid.Col span={12}>
                <SchedulePlanner cookie={cookie} />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {cookie === '' && (
          <Overlay color="#000">
            <CircularProgress
              sx={{
                color: 'white',
                margin: '0rem 1rem',
                marginBottom: '2rem',
              }}
            />
            <Typography
              variant="h4"
              style={{ color: '#fff', marginBottom: '2rem' }}
            >
              Loading...
            </Typography>
          </Overlay>
        )}
      </Box>
    </MantineProvider>
  );
}

export default App;
