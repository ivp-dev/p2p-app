import { useContext, useEffect } from 'react';
import * as types from './types';
import { AppContext } from './state/app-context';
import Player from './components/player';

import './styles/app.scss';

function App() {
  const { state } = useContext(AppContext);

  useEffect(() => {
    if (state.theme === types.Theme.Dark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [state]);

  return (
    <div className="container">
      <Player />
    </div>
  );
}

export default App;
