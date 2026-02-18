import '../App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../Theme';
import { format, sub } from 'date-fns';
import { useState } from 'react';
import {
  DateTimeField,
  WidgetBox,
  PillButton,
  TimeField,
} from './ReusableComponents';
import { Button, Grid, Title, Typography } from '@mantine/core';

function TimeCalculator() {
  const [arrTime, setArrTime] = useState<Date | null>(null);
  const [travelDur, setTravelDur] = useState('');
  const [depTime, setDepTime] = useState<Date | null>(null);
  const [prepDur, setPrepDur] = useState('');
  const [sleepDur, setSleepDur] = useState('');
  const [isEnterDur, setIsEnterDur] = useState(true);
  const [isDisp, setIsDisp] = useState(false);
  const [disp, setDisp] = useState({
    depTimeStr: '-',
    sleepTimeStr: '-',
    wakeTimeStr: '-',
  });

  let depTimeCalc: Date | null = null;
  let sleepTime: Date | null = null;
  let wakeTime: Date | null = null;

  const calc = () => {
    setIsDisp(false);

    let travelDurSplit = travelDur.split(':');
    let prepDurSplit = prepDur.split(':');
    let sleepDurSplit = sleepDur.split(':');

    if (isEnterDur) {
      // console.log(
      //   'Calculating departure time based on arrival time and travel duration',
      //   travelDur
      // );
      if (!arrTime || !travelDur || travelDurSplit.length < 2) {
        console.error('Invalid input for travel duration or arrival time');
        return;
      }
      depTimeCalc = sub(arrTime, {
        hours: parseInt(travelDurSplit[0]),
        minutes: parseInt(travelDurSplit[1]),
      });
    } else {
      if (!depTime) return;
      depTimeCalc = depTime;
    }

    wakeTime =
      depTimeCalc && prepDur && prepDurSplit.length === 2
        ? sub(depTimeCalc, {
            hours: parseInt(prepDurSplit[0]),
            minutes: parseInt(prepDurSplit[1]),
          })
        : null;
    sleepTime =
      wakeTime && sleepDur && sleepDurSplit.length === 2
        ? sub(wakeTime, {
            hours: parseInt(sleepDurSplit[0]),
            minutes: parseInt(sleepDurSplit[1]),
          })
        : null;

    let depTimeStr = !depTimeCalc
      ? '-'
      : format(depTimeCalc, 'dd/MM/yyyy, hh:mm a');
    let sleepTimeStr = !sleepTime
      ? '-'
      : format(sleepTime, 'dd/MM/yyyy, hh:mm a');
    let wakeTimeStr = !wakeTime ? '-' : format(wakeTime, 'dd/MM/yyyy, hh:mm a');

    setIsDisp(() => depTimeStr !== '-');
    setDisp({
      depTimeStr: depTimeStr,
      sleepTimeStr: sleepTimeStr,
      wakeTimeStr: wakeTimeStr,
    });
  };

  return (
    <WidgetBox>
      <Title
        order={3}
        style={{ marginBottom: '0.5rem' }}
      >
        Prep Time Planner
      </Title>

      <Grid>
        {isEnterDur && (
          <Grid.Col span={12}>
            <DateTimeField
              label="Arrive at destination by"
              onChange={(t) => (t == null ? null : setArrTime(new Date(t)))}
              value={arrTime}
              required
              // style={{ margin: '4px 0px' }}
            />
          </Grid.Col>
        )}

        <Grid.Col span={12}>
          {isEnterDur ? (
            <TimeField
              id="travelDur"
              label="Travel duration [HH:mm]"
              onChange={(d) => setTravelDur(d)}
              style={{ margin: '4px 0px' }}
              required
            />
          ) : (
            <DateTimeField
              label="Depart by"
              onChange={(t) => (t == null ? null : setDepTime(new Date(t)))}
              value={depTime}
              style={{ margin: '4px 0px' }}
              required
            />
          )}

          <Button
            aria-label="switchInputType"
            onClick={() => setIsEnterDur(!isEnterDur)}
            style={{ fontSize: '0.8rem' }}
            variant="subtle"
          >
            {isEnterDur
              ? 'Enter departure time instead'
              : 'Enter commute duration instead'}
          </Button>
        </Grid.Col>

        <Grid.Col span={12}>
          <TimeField
            id="prepDur"
            label="Preparation duration [HH:mm]"
            onChange={(d) => setPrepDur(d)}
            style={{ margin: '4px 0px' }}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TimeField
            id="sleepDur"
            label="Sleep duration [HH:mm]"
            onChange={(d) => setSleepDur(d)}
            style={{ margin: '4px 0px' }}
          />
        </Grid.Col>

        <PillButton
          onClick={() => calc()}
          style={{ margin: '1rem 0px', width: '100%' }}
        >
          Calculate
        </PillButton>

        {isDisp && (
          <Grid.Col span={12}>
            <Typography>💤 Sleep by: {disp.sleepTimeStr}</Typography>
            <Typography>⏰ Start preparing by: {disp.wakeTimeStr}</Typography>
            <Typography>🚌 Depart by: {disp.depTimeStr}</Typography>
          </Grid.Col>
        )}
      </Grid>
    </WidgetBox>
  );
}

export default TimeCalculator;
