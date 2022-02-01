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
    <div className="modal">
      <div className="modal__dialog">
        <div className="modal__content">
          <button className="modal__close-btn" onClick={close} type="button">
            <CloseIcon />
          </button>
          <div className="modal__body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
