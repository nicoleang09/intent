import '../App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../Theme';
import { format, sub } from 'date-fns';
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  NumTextField,
  DateTimeField,
  WidgetBox,
  PillButton,
} from './ReusableComponents';

function TimeCalculator() {
  const [arrTime, setArrTime] = useState<Date | null>(null);
  const [travelDur, setTravelDur] = useState('');
  const [depTime, setDepTime] = useState<Date | null>(null);
  const [prepDur, setPrepDur] = useState('');
  const [sleepDur, setSleepDur] = useState('');
  const [isEnterDur, setIsEnterDur] = useState(true);
  const [isDisp, setIsDisp] = useState(false);
  const [disp, setDisp] = useState({
    depTimeStr: '',
    sleepTimeStr: '',
    wakeTimeStr: '',
  });

  let depTimeCalc: Date | null = null;
  let sleepTime: Date | null = null;
  let wakeTime: Date | null = null;

  const calc = () => {
    let travelDurSplit = travelDur.split(':');
    let prepDurSplit = prepDur.split(':');
    let sleepDurSplit = sleepDur.split(':');

    if (isEnterDur) {
      if (!arrTime || !travelDur || travelDurSplit.length < 2) return;

      console.log('Calculating with duration...');
      depTimeCalc = sub(arrTime, {
        hours: parseInt(travelDurSplit[0]),
        minutes: parseInt(travelDurSplit[1]),
      });
    } else {
      if (!depTime) return;

      console.log('Calculating with time...');
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
      ? ''
      : format(depTimeCalc, 'dd/MM/yyyy, hh:mm a');
    let sleepTimeStr = !sleepTime
      ? ''
      : format(sleepTime, 'dd/MM/yyyy, hh:mm a');
    let wakeTimeStr = !wakeTime ? '' : format(wakeTime, 'dd/MM/yyyy, hh:mm a');

    setIsDisp(() => depTimeStr !== '');
    setDisp({
      depTimeStr: depTimeStr,
      sleepTimeStr: sleepTimeStr,
      wakeTimeStr: wakeTimeStr,
    });

    console.log(
      'depTime',
      depTimeStr,
      'sleepTime',
      sleepTimeStr,
      'wakeTime',
      wakeTimeStr
    );
  };

  let theme = createTheme(lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <WidgetBox>
        <Typography
          variant="h3"
          marginBottom={'0.5rem'}
          color="primaryText"
        >
          Time Calculator
        </Typography>

        <Box>
          <DateTimeField
            label="Arrive by"
            onChangeFn={(t) => (t == null ? null : setArrTime(t))}
            value={arrTime}
            style={{ margin: '4px 0px' }}
          />

          {isEnterDur ? (
            <NumTextField
              id="travelDur"
              label="Travel duration [HH:mm]"
              onChange={(d) => setTravelDur(d.currentTarget.value)}
              style={{ margin: '4px 0px' }}
            />
          ) : (
            <DateTimeField
              label="Depart by"
              onChangeFn={(t) => (t == null ? null : setDepTime(t))}
              value={depTime}
              style={{ margin: '4px 0px' }}
            />
          )}

          <Button
            aria-label="switchInputType"
            onClick={() => setIsEnterDur(!isEnterDur)}
            sx={{ fontSize: '0.8rem' }}
          >
            {isEnterDur
              ? 'Enter departure time instead'
              : 'Enter commute duration instead'}
          </Button>

          <NumTextField
            id="prepDur"
            label="Preparation duration [HH:mm]"
            onChange={(d) => setPrepDur(d.currentTarget.value)}
            style={{ margin: '4px 0px' }}
          />

          <NumTextField
            id="sleepDur"
            label="Sleep duration [HH:mm]"
            onChange={(d) => setSleepDur(d.currentTarget.value)}
            style={{ margin: '4px 0px' }}
          />

          <PillButton
            onClick={() => calc()}
            style={{ margin: '1rem 0px' }}
          >
            Calculate
          </PillButton>
        </Box>

        {isDisp ? (
          <Box>
            <Typography color="primaryText">
              💤 Sleep by: {disp.sleepTimeStr}
            </Typography>
            <Typography color="primaryText">
              ⏰ Wake by: {disp.wakeTimeStr}
            </Typography>
            <Typography color="primaryText">
              🚌 Depart by: {disp.depTimeStr}
            </Typography>
          </Box>
        ) : (
          <Box></Box>
        )}
      </WidgetBox>
    </ThemeProvider>
  );
}

export default TimeCalculator;
