import type { CSSProperties } from 'react';

import AlertBox from '@components/AlertBox';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import ReactModal from 'react-modal';

const modalOverlayStyle: CSSProperties = {
  background: 'rgba(0, 0, 0, 0.5)',
};

const modalContentStyle: CSSProperties = {
  width: 'max-content',
  height: 'max-content',
  borderRadius: 10,
  padding: 0,
  inset: '50% 50%',
  transform: 'translate3d(-50%, -50%, 0)',
};

const AlertModal = () => {
  const { isOpen, description, onCancel, onSubmit, disabled } = useRootStore(
    (state) => state.alertModal,
  );

  const handleCloseAlertModal = () => {
    if (!disabled && onCancel) {
      onCancel();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      style={{ content: modalContentStyle, overlay: modalOverlayStyle }}
      onRequestClose={handleCloseAlertModal}
    >
      {onSubmit && onCancel && (
        <AlertBox
          description={description}
          onCancel={onCancel}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      )}
    </ReactModal>
  );
};

export default AlertModal;
