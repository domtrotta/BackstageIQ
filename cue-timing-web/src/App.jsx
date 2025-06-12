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
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      <div className="flex justify-between items-center mb-4">
        <div>Current Time: {new Date().toLocaleTimeString()}</div>
        <div>Total Time: {formatTime(totalElapsed)}</div>
      </div>

      <div className="space-y-2">
        {cues.map((cue, idx) => (
          <div key={cue.id} className={`p-2 rounded flex items-center ${cue.isActive ? 'bg-green-600' : 'bg-gray-800'}`}>
            <input
              value={cue.title}
              onChange={e => {
                const updated = [...cues];
                updated[idx].title = e.target.value;
                setCues(updated);
              }}
              className="bg-black border border-gray-600 p-1 mr-2 w-48"
            />
            <input
              value={formatTime(cue.presetTime)}
              onChange={e => {
                const [m, s] = e.target.value.split(':').map(Number);
                const updated = [...cues];
                updated[idx].presetTime = (m || 0) * 60 + (s || 0);
                setCues(updated);
              }}
              className="bg-black border border-gray-600 p-1 mr-2 w-20"
            />
            <span className="ml-auto text-black bg-white px-2 py-1 rounded">{formatTime(cue.elapsedTime)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={startShow} className="bg-blue-600 px-4 py-2 rounded">{isRunning ? 'Pause' : 'Start'} Show</button>
        <button onClick={nextCue} className="bg-green-600 px-4 py-2 rounded">Next Cue</button>
        <button onClick={resetTimers} className="bg-purple-600 px-4 py-2 rounded">Reset Time</button>
        <button onClick={newSession} className="bg-red-600 px-4 py-2 rounded">New</button>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          placeholder="New Cue Title"
          value={newCueTitle}
          onChange={e => setNewCueTitle(e.target.value)}
          className="bg-black border border-gray-600 p-2 w-48"
        />
        <input
          placeholder="mm:ss"
          value={newCueTime}
          onChange={e => setNewCueTime(e.target.value)}
          className="bg-black border border-gray-600 p-2 w-20"
        />
        <button onClick={addCue} className="bg-orange-500 px-4 py-2 rounded">Add Cue</button>
      </div>
    </div>
  );
}

export default App;
