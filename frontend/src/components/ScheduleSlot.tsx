import '../App.css';
import '../index.css';
import {
  Button,
  Typography,
  Grid,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { lightTheme } from '../Theme';

interface Props {
  dailyTasks: Object[];
  hour: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  onToggleCompleted: (id: string) => void;
}

let theme = createTheme(lightTheme);

function ScheduleSlot(props: Props) {
  return (
    <ThemeProvider theme={theme}>
      <Droppable
        droppableId={props.hour}
        type={props.listType}
        isCombineEnabled={false}
      >
        {(provided) => (
          <Grid
            container
            spacing={1}
            direction="row"
            alignItems="center"
            minHeight={'3rem'}
          >
            <Grid
              item
              xs="auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Typography
                variant="widgetText"
                color="textGrey"
              >
                {props.hour.substring(1)}
              </Typography>
            </Grid>

            <Grid
              item
              xs
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {props.dailyTasks.map((item: any, index: number) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task"
                    >
                      <Button
                        onClick={() => props.onToggleCompleted(item.id)}
                        style={{
                          marginRight: '8px',
                          padding: '0px',
                          color: '#000',
                          minWidth: '0',
                        }}
                      >
                        {item.isCompleted ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <CheckCircleOutlineIcon fontSize="small" />
                        )}
                      </Button>
                      <div>{item.title}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          </Grid>
        )}
      </Droppable>
    </ThemeProvider>
  );
}

export default ScheduleSlot;
