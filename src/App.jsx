import React, { useState, useEffect } from 'react';

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function App() {
  const [cues, setCues] = useState([
    { id: 1, title: 'CUE 1', presetTime: 0, elapsedTime: 0, isActive: false, startTime: null },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [activeCueIndex, setActiveCueIndex] = useState(null);
  const [newCueTitle, setNewCueTitle] = useState('');
  const [newCueTime, setNewCueTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setTotalElapsed(prev => prev + 1);
        setCues(prev => {
          const updated = [...prev];
          if (activeCueIndex !== null) {
            updated[activeCueIndex].elapsedTime += 1;
          }
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, activeCueIndex]);

  const startShow = () => {
    if (!isRunning) {
      setStartTimestamp(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const nextCue = () => {
    setCues(prev => {
      const updated = [...prev];
      if (activeCueIndex !== null) {
        updated[activeCueIndex].isActive = false;
      }
      const nextIndex = (activeCueIndex ?? -1) + 1;
      if (nextIndex < updated.length) {
        updated[nextIndex].isActive = true;
        updated[nextIndex].startTime = Date.now();
        setActiveCueIndex(nextIndex);
      }
      return updated;
    });
  };

  const resetTimers = () => {
    setTotalElapsed(0);
    setStartTimestamp(null);
    setCues(prev => prev.map(cue => ({ ...cue, elapsedTime: 0, startTime: null })));
  };

  const newSession = () => {
    setCues([{ id: 1, title: 'CUE 1', presetTime: 0, elapsedTime: 0, isActive: false, startTime: null }]);
    setIsRunning(false);
    setTotalElapsed(0);
    setStartTimestamp(null);
    setActiveCueIndex(null);
  };

  const addCue = () => {
    if (!newCueTitle) return;
    const [min, sec] = newCueTime.split(':').map(Number);
    const totalSec = (min || 0) * 60 + (sec || 0);
    setCues([...cues, {
      id: cues.length + 1,
      title: newCueTitle,
      presetTime: totalSec,
      elapsedTime: 0,
      isActive: false,
      startTime: null
    }]);
    setNewCueTitle('');
    setNewCueTime('');
  };

  return (
    <div className="min-h-screen bqi-grid-bg text-gray-100 flex flex-col pt-16 pb-24 px-4 bqi-overscroll">
      <header className="fixed top-0 left-0 right-0 bqi-header bg-neutral-950/80 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4">
        <div className="text-gray-400 text-sm">{new Date().toLocaleTimeString()}</div>
        <div className="time-mono time-xl font-bold">{formatTime(totalElapsed)}</div>
        <div className="w-16" /> {/* spacer for symmetry */}
      </header>

      <div className="overflow-y-auto scrollbar-thin no-scrollbar flex-1 space-y-2">
        {cues.map((cue, idx) => {
          let borderClass = 'border-l-4 ';
          if (cue.isActive) {
            borderClass += 'border-green-500';
          } else if (activeCueIndex !== null && idx === activeCueIndex + 1) {
            borderClass += 'border-yellow-500';
          } else {
            borderClass += 'border-gray-700 opacity-50';
          }
          return (
            <div key={cue.id} className={`bqi-panel flex items-center gap-2 p-3 ${borderClass}`}>
              <input
                value={cue.title}
                onChange={e => {
                  const updated = [...cues];
                  updated[idx].title = e.target.value;
                  setCues(updated);
                }}
                className="bg-neutral-900 border border-gray-700 text-gray-100 rounded px-2 py-1 time-mono w-full sm:w-64"
              />
              <input
                value={formatTime(cue.presetTime)}
                onChange={e => {
                  const [m, s] = e.target.value.split(':').map(Number);
                  const updated = [...cues];
                  updated[idx].presetTime = (m || 0) * 60 + (s || 0);
                  setCues(updated);
                }}
                className="bg-neutral-900 border border-gray-700 text-gray-100 rounded px-2 py-1 time-mono w-28 text-center"
              />
              <span className="ml-auto bg-gray-800 text-gray-100 rounded px-3 py-1 time-lg time-mono">{formatTime(cue.elapsedTime)}</span>
            </div>
          );
        })}
      </div>

      <div className="bqi-panel flex gap-2 p-3 mb-3 sticky bottom-24">
        <input
          placeholder="New Cue Title"
          value={newCueTitle}
          onChange={e => setNewCueTitle(e.target.value)}
          className="bg-neutral-900 border border-gray-700 text-gray-100 rounded px-2 py-1 time-mono flex-1"
        />
        <input
          placeholder="mm:ss"
          value={newCueTime}
          onChange={e => setNewCueTime(e.target.value)}
          className="bg-neutral-900 border border-gray-700 text-gray-100 rounded px-2 py-1 time-mono w-24"
        />
        <button onClick={addCue} className="bg-orange-500 tap-safe rounded-lg font-semibold px-4 btn-focus">Add Cue</button>
      </div>

      <footer className="fixed bottom-0 inset-x-0 bqi-footer bg-neutral-900/90 backdrop-blur bqi-divider safe-area-b px-3 flex items-center justify-around gap-2">
        <button onClick={startShow} className="tap-safe rounded-lg font-semibold px-6 py-3 bg-green-600 btn-focus"> {isRunning ? 'Pause' : 'Start'} Show </button>
        <button onClick={nextCue} className="tap-safe rounded-lg font-semibold px-6 py-3 bg-yellow-600 btn-focus">Next Cue</button>
        <button onClick={resetTimers} className="tap-safe rounded-lg font-semibold px-6 py-3 bg-blue-600 btn-focus">Reset Time</button>
        <button onClick={newSession} className="tap-safe rounded-lg font-semibold px-6 py-3 bg-red-600 btn-focus">New</button>
      </footer>
    </div>
  );
}

export default App;
