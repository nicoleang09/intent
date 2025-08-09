import '../App.css';
import '../index.css';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Divider, Grid, Typography } from '@mantine/core';
import TaskItem from './TaskItem';
import { Task } from '../utils/Types';

interface Props {
  dailyTasks: Object[];
  day: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  onToggleCompleted: (item: Task, day: string) => void;
  onDelete: (item: Task, day: string) => void;
}

function DailyAgenda(props: Props) {
  const onTaskCompleted = (item: Task) =>
    props.onToggleCompleted(item, props.day);

  const onDelete = (item: Task) => props.onDelete(item, props.day);

  return (
    <Droppable
      droppableId={props.day}
      type={props.listType}
      isCombineEnabled={false}
    >
      {(provided) => (
        <Grid.Col
          span={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          style={{ minHeight: '16rem' }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Typography
            variant="widgetText"
            color="textGrey"
            style={{ marginBottom: '0.75rem' }}
          >
            {props.day}
          </Typography>
          <Divider my="sm" />

          {props.dailyTasks.map((item: any, index: number) => (
            <Draggable
              key={item.id}
              draggableId={item.id}
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
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Grid.Col>
      )}
    </Droppable>
  );
}

export default DailyAgenda;
