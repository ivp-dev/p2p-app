import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import {
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';
import * as types from '../types';
import * as Icons from '../icons';
import ThemeToggleButton from './theme-toggle-btn';
import Video from './video';

interface ViewportProps {
  stop: () => void;
  start: () => void;
  call: () => void;
}

function Viewport({ start, stop, call }: ViewportProps) {
  const [toggleSettingsDropdown, setToggleSettingsDropdown] = useState(false);

  const { outcomingStream, incomingStream } = useContext(ViewportContext);

  const dropdownRef = useRef(null);

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
          <Icons.VideoIcon />
        </button>
        <button type="button" className="call-btn rounded" onClick={() => call()}>
          <Icons.PhoneIcon />
        </button>
        <button type="button" className="hang-up-btn rounded" onClick={() => stop()}>
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
    </div>
  );
}

export const ViewportContext = createContext<types.ViewportContext>({
  outcomingStream: null,
  incomingStream: null,
});

export default Viewport;
