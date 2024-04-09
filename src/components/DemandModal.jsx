import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

function DemandModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Input Figures for Demand Forecasting Below">
        {/* Modal content */}
        <p>Insert input parameters here</p>
      </Modal>

      <Button onClick={open}>Input Demand Figures</Button>
    </>
  );
}

export default DemandModal;