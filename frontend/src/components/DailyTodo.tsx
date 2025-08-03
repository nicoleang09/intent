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
  day: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  onToggleCompleted: (id: string) => void;
}

let theme = createTheme(lightTheme);

function DailyTodo(props: Props) {
  return (
    <ThemeProvider theme={theme}>
      <Droppable
        droppableId={props.day}
        type={props.listType}
        isCombineEnabled={false}
      >
        {(provided) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            minHeight={'16rem'}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Typography
              variant="widgetText"
              color="textGrey"
              marginBottom={'0.75rem'}
            >
              {props.day}
            </Typography>

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
        )}
      </Droppable>
    </ThemeProvider>
  );
}

export default DailyTodo;
