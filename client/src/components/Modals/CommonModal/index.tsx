import type { CSSProperties, FC } from 'react';

import { useRootStore } from '@stores/rootStore';
import React, { useMemo } from 'react';
import ReactModal from 'react-modal';

const OverlayBackground = {
  black: 'rgba(0, 0, 0, 0.5)',
  white: 'rgba(255, 255, 255, 0.5)',
  transparent: 'transparent',
} as const;

const CommonModal: FC = () => {
  const {
    isOpen,
    content: Content,
    overlayBackground,
    onCancel,
    transform,
    x = 1,
    y = 1,
  } = useRootStore((state) => state.commonModal);
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const overlayStyle: CSSProperties = useMemo(
    () => ({
      background: OverlayBackground[overlayBackground],
    }),
    [overlayBackground],
  );

  const contentStyle: CSSProperties = useMemo(
    () => ({
      width: 'max-content',
      height: 'max-content',
      padding: 0,
      border: 0,
      top: y,
      left: x,
      transform,
    }),
    [x, y, transform],
  );

  return (
    <ReactModal
      isOpen={isOpen}
      style={{
        overlay: overlayStyle,
        content: contentStyle,
      }}
      onRequestClose={onCancel ?? closeCommonModal}
    >
      {Content}
    </ReactModal>
  );
};

export default CommonModal;
