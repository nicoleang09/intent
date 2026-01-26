import { ActionIcon, Flex, Typography } from '@mantine/core';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../utils/Types';

interface TaskItemProps {
  item: Task;
  onToggleCompleted: (item: Task) => void;
  onDelete: (item: Task) => void;
  onEdit: (item: Task) => void;
  innerRef?: (element: HTMLElement | null) => any;
  draggableProps?: any;
  dragHandleProps?: any;
}

const TaskItem = ({
  item,
  onToggleCompleted,
  onDelete,
  onEdit,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TaskItemProps) => (
  <Flex
    ref={innerRef}
    {...draggableProps}
    {...dragHandleProps}
    className="task"
  >
    <ActionIcon
      onClick={() => onToggleCompleted(item)}
      variant="transparent"
      style={{
        marginRight: '8px',
        padding: '0px',
        minWidth: '0',
      }}
    >
      {item.isCompleted ? (
        <CheckCircleIcon fontSize="small" />
      ) : (
        <CheckCircleOutlineIcon fontSize="small" />
      )}
    </ActionIcon>
    <Typography
      style={{ flexGrow: 1 }}
      td={item.isCompleted ? 'line-through' : 'none'}
    >
      {item.title}
    </Typography>
    <ActionIcon
      onClick={() => onEdit(item)}
      variant="transparent"
      style={{ justifySelf: 'flex-end' }}
    >
      <EditIcon fontSize="small" />
    </ActionIcon>
    <ActionIcon
      onClick={() => onDelete(item)}
      variant="transparent"
      style={{ justifySelf: 'flex-end' }}
    >
      <DeleteIcon fontSize="small" />
    </ActionIcon>
  </Flex>
);

export default TaskItem;
