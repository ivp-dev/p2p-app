import { format } from 'date-fns';
import { useCallback, useContext } from 'react';
import * as Icons from '../icons';
import { AppContext } from '../state/app-context';
import { removeFronHistoryActionCreator } from '../state/app-reducer';
import { CallHistory } from '../types';

function HistoryTable() {
  const { state, updateState } = useContext(AppContext);
  const removeRecord = useCallback(
    (id: string) => {
      updateState(removeFronHistoryActionCreator(id));
    },
    [updateState],
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Call started</th>
          <th>Call ended</th>
          <th>Duration (seconds)</th>
          <th>Controls</th>
        </tr>
      </thead>
      <tbody>
        {state.history.map((record) => (
          <HistoryRecord
            key={record.id}
            record={record}
            remove={removeRecord}
          />
        ))}
        <tr className="table__footer">
          <td colSpan={4}>
            {`Total duration (seconds): ${state.history.reduce(
              (acc, h) => acc + h.duration / 1000,
              0,
            ).toFixed(2)}`}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

interface HistoryRecordProps {
  record: CallHistory;
  remove: (id: string) => void;
}

function HistoryRecord({ record, remove }: HistoryRecordProps) {
  return (
    <tr key={record.id}>
      <td>{format(record.start, 'yyyy-MM-dd HH:mm:ss')}</td>
      <td>{format(record.stop, 'yyyy-MM-dd HH:mm:ss')}</td>
      <td>{`${(record.duration / 1000).toFixed(2)}`}</td>
      <td>
        <button
          type="button"
          className="remove-history-btn"
          onClick={() => remove(record.id)}
        >
          <Icons.TrashIcon />
        </button>
      </td>
    </tr>
  );
}

export default HistoryTable;
