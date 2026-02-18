import { Button, Grid, Modal, Select, TextInput } from '@mantine/core';

export type ClearTaskAction = 'uncheck' | 'delete';

export interface ClearTaskDialogProps {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onClose: (action: ClearTaskAction) => void;
  dialogAction: ClearTaskAction | null;
}

export const ClearTaskDialog = (props: ClearTaskDialogProps) => {
  const handleClose = () => {
    props.setDialogOpen(false);
  };

  return (
    <Modal
      opened={props.isDialogOpen}
      title={`Are you sure you want to ${props.dialogAction === 'delete' ? 'delete' : 'uncheck'} all tasks?`}
      onClose={handleClose}
      centered
      withCloseButton={false}
    >
      <Grid>
        <Grid.Col>This action is not reversible!</Grid.Col>
        <Grid.Col span={12}>
          <Grid
            gutter={10}
            justify="right"
          >
            <Grid.Col span="content">
              <Button
                key="cancel"
                onClick={() => handleClose()}
                variant="outline"
              >
                Cancel
              </Button>
            </Grid.Col>
            <Grid.Col span="content">
              <Button
                key="confirm"
                onClick={() => {
                  if (props.dialogAction) props.onClose(props.dialogAction);
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
