import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import * as types from '../types';
import * as Icons from '../icons';
import ThemeToggleButton from './theme-toggle-btn';
import Video from './video';
import { AppContext } from '../state/app-context';
import { removeFronHistoryActionCreator } from '../state/app-reducer';

interface ViewportProps {
  start: () => void;
  call: () => void;
}

function Viewport({ start, call }: ViewportProps) {
  const [toggleSettingsDropdown, setToggleSettingsDropdown] = useState(false);
  const { outcomingStream, incomingStream } = useContext(ViewportContext);
  const dropdownRef = useRef(null);
  const hasIncome = incomingStream?.active;
  const hasOutcome = outcomingStream?.active;
  const [showHistory, setShowHistory] = useState(false);

  const closeCallback = useCallback(() => {
    setShowHistory((value) => !value);
  }, []);

  return (
    <div className="viewport">
      {outcomingStream && (
        <Video stream={outcomingStream} autoPlay className="full-size" />
      )}

      <div className="incomes__container">
        {incomingStream && (
          <Video stream={incomingStream} autoPlay className="full-size rounded-1" />
        )}
      </div>

      <div className="control-pane">
        <button type="button" className="start-btn rounded" onClick={() => start()}>
          {hasOutcome ? <Icons.VideoOffIcon /> : <Icons.VideoIcon />}
        </button>
        <button type="button" disabled={!hasOutcome} className={classNames('call-btn', 'rounded', hasIncome && 'stop')} onClick={() => call()}>
          {hasIncome ? <Icons.PhoneStopIcon /> : <Icons.PhoneIcon />}
        </button>
        <button type="button" className="hang-up-btn rounded" onClick={() => setShowHistory((current) => !current)}>
          <Icons.HistoryIcon />
        </button>
      </div>

      <div className={classNames('settings-pane', toggleSettingsDropdown && 'active')}>
        <div className="dropdown-menu">
          <button type="button" className="settings-btn rounded-0" onClick={() => setToggleSettingsDropdown((isToggled) => !isToggled)}>
            <Icons.SettingsIcon />
          </button>
          <CSSTransition
            in={toggleSettingsDropdown}
            nodeRef={dropdownRef}
            timeout={500}
            classNames="dropdown"
          >
            <ul ref={dropdownRef} className="dropdown">
              <li className="dropdown-menu__item">
                <ThemeToggleButton />
              </li>
            </ul>
          </CSSTransition>
        </div>
      </div>

      {showHistory && <HistoryModal close={closeCallback} />}
    </div>
  );
}

export const ViewportContext = createContext<types.ViewportContext>({
  outcomingStream: null,
  incomingStream: null,
});

export default Viewport;

interface HistoryModalProps {
  close: () => void
}

function HistoryModal({ close }: HistoryModalProps) {
  const { state, updateState } = useContext(AppContext);

  const removeRecord = useCallback((id: string) => {
    updateState(removeFronHistoryActionCreator(id));
  }, [updateState]);

  return (
    <div className="history-modal">
      <button className="history-modal__close-btn" onClick={close} type="button">
        <Icons.CloseIcon />
      </button>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date start</th>
            <th>Date end</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {
            state.history.map((record) => (
              <HistoryRecord key={record.id} record={record} remove={removeRecord} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

interface HistoryRecordProps {
  record: types.CallHistory
  remove: (id: string) => void
}

function HistoryRecord({ record, remove }: HistoryRecordProps) {
  return (
    <tr key={record.id}>
      <td>{record.start}</td>
      <td>{record.stop}</td>
      <td>{record.duration}</td>
      <td>
        <button type="button" onClick={() => remove(record.id)}>Remove</button>
      </td>
    </tr>
  );
}
