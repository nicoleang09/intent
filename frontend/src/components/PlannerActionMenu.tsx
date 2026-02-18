import { ActionIcon, Menu } from '@mantine/core';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ClearTaskAction, ClearTaskDialog } from './ClearTasksDialog';
import { useState } from 'react';

export interface PlannerActionMenuProps {
  onUncheckAll: () => void;
  onDeleteAll: () => void;
}

export const PlannerActionMenu = (props: PlannerActionMenuProps) => {
  const [clearDialogState, setClearDialogState] = useState<{
    isOpen: boolean;
    action: ClearTaskAction | null;
  }>({ isOpen: false, action: null });

  return (
    <>
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
          <Menu.Label>Task Actions</Menu.Label>
          <Menu.Item
            leftSection={<CheckCircleOutlineIcon fontSize="small" />}
            onClick={() =>
              setClearDialogState({ isOpen: true, action: 'uncheck' })
            }
          >
            Uncheck All
          </Menu.Item>
          <Menu.Item
            leftSection={<DeleteForeverIcon fontSize="small" />}
            onClick={() =>
              setClearDialogState({ isOpen: true, action: 'delete' })
            }
          >
            Delete All
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ClearTaskDialog
        isDialogOpen={clearDialogState.isOpen}
        setDialogOpen={(open) =>
          setClearDialogState({ ...clearDialogState, isOpen: open })
        }
        onClose={(action) => {
          if (action === 'uncheck') props.onUncheckAll();
          else if (action === 'delete') props.onDeleteAll();
          setClearDialogState({ isOpen: false, action: null });
        }}
        dialogAction={clearDialogState.action}
      />
    </>
  );
};
