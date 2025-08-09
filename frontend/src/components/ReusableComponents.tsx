import {
  Button,
  Card,
  CardProps,
  NumberInput,
  NumberInputProps,
} from '@mantine/core';
import {
  DateTimePicker,
  DateTimePickerProps,
  TimePicker,
  TimePickerProps,
} from '@mantine/dates';

export const WidgetBox = (props: CardProps) => {
  return (
    <Card
      withBorder
      style={{
        ...props.style,
        // backgroundColor: 'widgetBg',
        // borderRadius: '16px',
        padding: '1.5rem',
      }}
    >
      {props.children}
    </Card>
  );
};

export const NumTextField = (props: NumberInputProps) => {
  return (
    <NumberInput
      id={props.id}
      label={props.label}
      onChange={props.onChange}
      style={props.style}
    />
  );
};

export const TimeField = (props: TimePickerProps) => {
  return (
    <TimePicker
      id={props.id}
      label={props.label}
      onChange={props.onChange}
      style={props.style}
      withDropdown
      clearable
      {...props}
    />
  );
};

export const DateTimeField = (props: DateTimePickerProps) => {
  return (
    <DateTimePicker
      id={props.id}
      label={props.label}
      onChange={props.onChange}
      value={props.value}
      style={props.style}
      highlightToday
      clearable
      timePickerProps={{
        withDropdown: true,
        popoverProps: { withinPortal: false },
        format: '12h',
      }}
      {...props}
    />
  );
};

export const PillButton = (props: any) => {
  return (
    <Button
      variant="outline"
      radius="xl"
      style={props.style}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </Button>
  );
};

// export const DottedButton = (props: ButtonProps) => {
//   return (
//     <Button
//       variant="outlined"
//       sx={{
//         fontSize: '0.8rem',
//         padding: '0px 8px',
//         border: '2px dashed',
//         borderColor: 'textGrey',
//         borderRadius: '24px',
//         textTransform: 'none',
//         color: 'textGrey',

//         '&:hover': {
//           backgroundColor: 'textGrey',
//           color: 'white',
//           border: '2px solid',
//           borderColor: 'textGrey',
//         },
//       }}
//       style={props.style}
//       onClick={props.onClick}
//     >
//       {props.children}
//     </Button>
//   );
// };

// export type DialogAction = {
//   name: string;
//   action: () => void;
// };

// interface DialogBoxProps extends DialogProps {
//   open: boolean;
//   dialogTitle: string;
//   dialogContent?: ReactNode;
//   handleClose?: () => void;
//   actions?: DialogAction[] | null;
// }

// export const DialogBox = (props: DialogBoxProps) => {
//   return (
//     <Dialog
//       fullWidth
//       open={props.open}
//       onClose={props.handleClose}
//       maxWidth="xs"
//       sx={{ textAlign: 'center' }}
//     >
//       <DialogTitle>{props.dialogTitle}</DialogTitle>
//       <DialogContent>{props.dialogContent}</DialogContent>
//       <DialogActions
//         sx={{ justifyContent: 'center', textTransform: 'capitalize' }}
//       >
//         {props.actions ? (
//           props.actions.map((action) => {
//             return (
//               <Button
//                 key={action.name}
//                 onClick={action.action}
//               >
//                 {action.name}
//               </Button>
//             );
//           })
//         ) : (
//           <p></p>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };
