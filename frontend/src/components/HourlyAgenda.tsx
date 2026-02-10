import '../App.css';
import '../index.css';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { Divider, Grid, Typography } from '@mantine/core';
import { Task } from '../utils/Types';
import { AddTaskInfo } from './AddTaskDialog';

interface Props {
  dailyTasks: Task[];
  hour: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  onToggleCompleted: (item: Task, hour: string) => void;
  onDelete: (item: Task, hour: string) => void;
  onEdit: (taskInfo: AddTaskInfo) => void;
}

function HourlyAgenda(props: Props) {
  const onTaskCompleted = (item: Task) =>
    props.onToggleCompleted(item, props.hour);

  const onDelete = (item: Task) => props.onDelete(item, props.hour);

  return (
    <Droppable
      droppableId={props.hour}
      type={props.listType}
      isCombineEnabled={false}
    >
      {(provided) => (
        <Grid
          style={{
            display: 'flex',
            width: '100%',
            minHeight: '3rem',
          }}
          align="center"
        >
          <Grid.Col
            span={2}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Typography
              variant="widgetText"
              // color="textGrey"
            >
              {props.hour.substring(1)}
            </Typography>
          </Grid.Col>

          <Grid.Col
            span="auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.dailyTasks.map(
              (item: Task, index: number) =>
                item && (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <TaskItem
                        item={item}
                        onToggleCompleted={onTaskCompleted}
                        onDelete={onDelete}
                        innerRef={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        onEdit={(item) => {
                          props.onEdit({
                            id: item.id,
                            taskName: item.title,
                            slot: props.hour,
                          });
                        }}
                      />
                    )}
                  </Draggable>
                ),
            )}
            {provided.placeholder}
          </Grid.Col>
        </Grid>
      )}
    </Droppable>
  );
}

export default HourlyAgenda;
