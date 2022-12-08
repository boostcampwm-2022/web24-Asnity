import type { CSSProperties, FC } from 'react';

import { useRootStore } from '@stores/rootStore';
import React from 'react';
import ReactModal from 'react-modal';

const OverlayBackground = {
  black: 'rgba(0, 0, 0, 0.5)',
  white: 'rgba(255, 255, 255, 0.5)',
  transparent: 'transparent',
} as const;

const CommonModal: FC = () => {
  const { isOpen, content, overlayBackground, onCancel, contentWrapperStyle } =
    useRootStore((state) => state.commonModal);
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const modalOverlayStyle: CSSProperties = {
    background: OverlayBackground[overlayBackground],
  };

  const modalContentStyle: CSSProperties = {
    width: 'max-content',
    height: 'max-content',
    padding: 0,
    top: '',
    left: '',
    ...contentWrapperStyle,
  };

  return (
    <ReactModal
      isOpen={isOpen}
      style={{ content: modalContentStyle, overlay: modalOverlayStyle }}
      onRequestClose={onCancel ?? closeCommonModal}
      overlayRef={(ref) => {
        if (!ref) return;
        ref.addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });
      }}
    >
      {content}
    </ReactModal>
  );
};

export default CommonModal;
