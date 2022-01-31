import { useContext } from 'react';
import { Theme } from '../types';
import { AppContext } from '../state/app-context';
import { setThemeActionCreator } from '../state/app-reducer';
import * as Icons from '../icons';

function ThemeToggleButton() {
  const { state, updateState } = useContext(AppContext);

  const toggleTheme = () => {
    const theme = state.theme === Theme.Light ? Theme.Dark : Theme.Light;
    updateState(setThemeActionCreator(theme));
  };

  const isDarkTheme = state.theme === Theme.Dark;

  return (
    <button
      type="button"
      className="theme-toggle-btn rounded-0"
      onClick={toggleTheme}
    >
      <span>
        {isDarkTheme ? <Icons.DarkThemeIcon /> : <Icons.LightThemeIcon />}
      </span>
    </button>
  );
}

export default ThemeToggleButton;
