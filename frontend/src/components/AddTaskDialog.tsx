import { Button, Grid, Modal, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export interface AddTaskDialogProps {
  slotLabel: string;
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleAddTask: (taskName: string, taskSlot: string) => void;
  slotList: string[];
}

export const AddTaskDialog = (props: AddTaskDialogProps) => {
  const handleClose = () => {
    form.reset();
    props.setDialogOpen(false);
  };

  const validateRequiredField = (value: string) =>
    value.length > 0 ? null : 'This field is required';
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      taskName: '',
      slot: '',
    },

    validate: {
      taskName: (value) => validateRequiredField(value),
      slot: (value) => validateRequiredField(value),
    },
  });

  return (
    <Modal
      opened={props.isDialogOpen}
      title={'Add New Task'}
      onClose={handleClose}
      centered
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const validation = form.validate();
          if (validation.hasErrors) return;
          props.handleAddTask(form.values.taskName, form.values.slot);
        }}
      >
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              id="task-name"
              label="Task name"
              key={form.key('taskName')}
              {...form.getInputProps('taskName')}
              required
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label={props.slotLabel}
              id="slot-selection"
              key={form.key('slot')}
              {...form.getInputProps('slot')}
              data={props.slotList}
              required
              comboboxProps={{ offset: 0, withinPortal: true }}
            />
          </Grid.Col>

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
                  key="add"
                  type="submit"
                >
                  Add
                </Button>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};
