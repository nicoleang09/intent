import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../Theme';
import {
  TextField,
  Card,
  Button,
  CardProps,
  ButtonProps,
  StandardTextFieldProps,
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReactNode } from 'react';

let theme = createTheme(lightTheme);

export const WidgetBox = (props: CardProps) => {
  return (
    <Card
      sx={{
        backgroundColor: 'widgetBg',
        borderRadius: '16px',
        boxShadow: 0,
        padding: '1.5rem',
      }}
      style={props.style}
    >
      {props.children}
    </Card>
  );
};

export const GenTextField = (props: StandardTextFieldProps) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        fullWidth
        id={props.id}
        label={props.label}
        variant="standard"
        inputProps={{ inputMode: 'text' }}
        onChange={props.onChange}
        sx={{ label: { color: 'textGrey' } }}
        style={props.style}
      />
    </ThemeProvider>
  );
};

export const NumTextField = (props: StandardTextFieldProps) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        fullWidth
        id={props.id}
        label={props.label}
        variant="standard"
        inputProps={{ inputMode: 'text', pattern: '[0-9][0-9][:][0-9][0-9]' }}
        onChange={props.onChange}
        sx={{ label: { color: 'textGrey' } }}
        style={props.style}
      />
    </ThemeProvider>
  );
};

interface DateTimeFieldProps {
  value: Date | null;
  label: string;
  onChangeFn: (...args: any) => any;
  style?: any | null;
}

export const DateTimeField = (props: DateTimeFieldProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        ampm
        closeOnSelect
        label={props.label}
        onChange={props.onChangeFn}
        value={props.value}
        inputFormat="dd/MM/yyyy hh:mm a"
        renderInput={(params) => (
          <TextField
            fullWidth
            variant="standard"
            sx={{ label: { color: 'textGrey' } }}
            style={props.style}
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export const PillButton = (props: ButtonProps) => {
  return (
    <Button
      variant="outlined"
      sx={{
        padding: '7px 24px',
        border: '2px solid',
        borderRadius: '24px',

        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          border: '2px solid',
          borderColor: 'primary.main',
        },
      }}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export const DottedButton = (props: ButtonProps) => {
  return (
    <Button
      variant="outlined"
      sx={{
        fontSize: '0.8rem',
        padding: '0px 8px',
        border: '2px dashed',
        borderColor: 'textGrey',
        borderRadius: '24px',
        textTransform: 'none',
        color: 'textGrey',

        '&:hover': {
          backgroundColor: 'textGrey',
          color: 'white',
          border: '2px solid',
          borderColor: 'textGrey',
        },
      }}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export type DialogAction = {
  name: string;
  action: () => void;
};

interface DialogBoxProps extends DialogProps {
  open: boolean;
  dialogTitle: string;
  dialogContent?: ReactNode;
  handleClose?: () => void;
  actions?: DialogAction[] | null;
}

export const DialogBox = (props: DialogBoxProps) => {
  return (
    <Dialog
      fullWidth
      open={props.open}
      onClose={props.handleClose}
      maxWidth="xs"
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>{props.dialogTitle}</DialogTitle>
      <DialogContent>{props.dialogContent}</DialogContent>
      <DialogActions
        sx={{ justifyContent: 'center', textTransform: 'capitalize' }}
      >
        {props.actions ? (
          props.actions.map((action) => {
            return (
              <Button
                key={action.name}
                onClick={action.action}
              >
                {action.name}
              </Button>
            );
          })
        ) : (
          <p></p>
        )}
      </DialogActions>
    </Dialog>
  );
};
