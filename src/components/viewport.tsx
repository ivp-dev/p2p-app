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
import HistoryModal from './history-modal';
import HistoryTable from './history-table';

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
          <Video
            stream={incomingStream}
            autoPlay
            className="full-size rounded-1"
          />
        )}
      </div>

      <div className="control-pane">
        <button
          type="button"
          className="start-btn rounded"
          onClick={() => start()}
        >
          {hasOutcome ? <Icons.VideoOffIcon /> : <Icons.VideoIcon />}
        </button>
        <button
          type="button"
          disabled={!hasOutcome}
          className={classNames('call-btn', 'rounded', hasIncome && 'stop')}
          onClick={() => call()}
        >
          {hasIncome ? <Icons.PhoneStopIcon /> : <Icons.PhoneIcon />}
        </button>
        <button
          type="button"
          className="hang-up-btn rounded"
          onClick={() => setShowHistory((current) => !current)}
        >
          <Icons.HistoryIcon />
        </button>
      </div>

      <div
        className={classNames(
          'settings-pane',
          toggleSettingsDropdown && 'active',
        )}
      >
        <div className="dropdown-menu">
          <button
            type="button"
            className="settings-btn rounded-0"
            onClick={() => setToggleSettingsDropdown((isToggled) => !isToggled)}
          >
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

      {showHistory && (
        <HistoryModal close={closeCallback}>
          <HistoryTable />
        </HistoryModal>
      )}
    </div>
  );
}

export const ViewportContext = createContext<types.ViewportContext>({
  outcomingStream: null,
  incomingStream: null,
});

export default Viewport;
