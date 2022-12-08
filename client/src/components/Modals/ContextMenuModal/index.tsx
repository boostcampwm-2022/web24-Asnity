import type { CSSProperties, FC } from 'react';

import { useRootStore } from '@stores/rootStore';
import React from 'react';
import ReactModal from 'react-modal';

const modalOverlayStyle: CSSProperties = {
  background: 'transparent',
};

interface Props {}

ReactModal.setAppElement('#root');

const ContextMenuModal: FC<Props> = () => {
  const { contentWrapperStyle, isOpen, content } = useRootStore(
    (state) => state.contextMenuModal,
  );

  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const modalContentStyle: CSSProperties = {
    width: 'max-content',
    height: 'max-content',
    padding: 0,
    ...contentWrapperStyle,
  };

  return (
    <ReactModal
      isOpen={isOpen}
      style={{ content: modalContentStyle, overlay: modalOverlayStyle }}
      onRequestClose={closeContextMenuModal}
      overlayRef={(ref) => {
        if (!ref) return;
        ref.addEventListener('mousedown', (e) => {
          if (e.target === ref) {
            closeContextMenuModal();
          }
        });
        ref.addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });
      }}
    >
      {content}
    </ReactModal>
  );
};

export default ContextMenuModal;
