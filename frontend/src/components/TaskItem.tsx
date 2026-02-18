import { ActionIcon, Flex, Menu, Typography } from '@mantine/core';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Task } from '../utils/Types';

interface TaskItemProps {
  item: Task;
  onToggleCompleted: (item: Task) => void;
  onDelete: (item: Task) => void;
  onEdit: (item: Task) => void;
  onClone?: (item: Task) => void;
  innerRef?: (element: HTMLElement | null) => any;
  draggableProps?: any;
  dragHandleProps?: any;
}

const TaskItem = ({
  item,
  onToggleCompleted,
  onDelete,
  onEdit,
  onClone,
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

    <Menu
      width={150}
      position="bottom-end"
    >
      <Menu.Target>
        <ActionIcon variant="transparent">
          <MoreHorizIcon fontSize="small" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item
          leftSection={<EditIcon fontSize="small" />}
          onClick={() => onEdit(item)}
        >
          Edit
        </Menu.Item>
        {onClone && (
          <Menu.Item
            leftSection={<ContentCopyIcon fontSize="small" />}
            onClick={() => onClone(item)}
          >
            Clone
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={<DeleteIcon fontSize="small" />}
          onClick={() => onDelete(item)}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  </Flex>
);

export default TaskItem;
