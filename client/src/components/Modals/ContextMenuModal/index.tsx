import type { CSSProperties } from 'react';

import CommunityContextMenu from '@components/CommunityContextMenu';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import ReactModal from 'react-modal';

const modalOverlayStyle: CSSProperties = {
  background: 'transparent',
};

interface Props {}

ReactModal.setAppElement('#root');

const ContextMenuModal: React.FC<Props> = () => {
  const { x, y, isOpen, data, type } = useRootStore(
    (state) => state.contextMenuModal,
  );

  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const modalContentStyle: CSSProperties = {
    width: 'max-content',
    height: 'max-content',
    left: x,
    top: y,
    borderRadius: 10,
    padding: 0,
  };

  let ContextMenu;

  if (type === 'community')
    ContextMenu = <CommunityContextMenu community={data} />;
  else if (type === 'channel')
    // TODO: ChannelContextMenu로 바꿔야함.
    ContextMenu = <CommunityContextMenu community={data} />;

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
      {ContextMenu}
    </ReactModal>
  );
};

export default ContextMenuModal;
