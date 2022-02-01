import { PropsWithChildren } from 'react';
import { CloseIcon } from '../icons';

interface HistoryModalProps {
  close: () => void;
}

function HistoryModal({
  close,
  children,
}: PropsWithChildren<HistoryModalProps>) {
  return (
    <div className="history-modal">
      <button
        className="history-modal__close-btn"
        onClick={close}
        type="button"
      >
        <CloseIcon />
      </button>
      <div className="scroll-content">{children}</div>
    </div>
  );
}

export default HistoryModal;
