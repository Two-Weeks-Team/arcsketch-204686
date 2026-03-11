"use client";

import { useEffect, useState } from "react";
import { getProjects } from '@/lib/api';

const CollectionPanel = ({ project }: { project: any }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching version history
    const mockHistory = [
      { id: 'v1', timestamp: '2026-03-10T15:40:00Z', note: 'Auto-save after AI-Snap' },
      { id: 'v2', timestamp: '2026-03-10T15:55:12Z', note: 'User snapshot before export' }
    ];
    setHistory(mockHistory);
  }, [project]);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">History</h3>
      <div className="space-y-2">
        {history.map((entry, index) => (
          <div key={index} className="p-2 bg-muted rounded">
            <p className="font-medium">Version {entry.id}</p>
            <p>{new Date(entry.timestamp).toLocaleString()}</p>
            <p>{entry.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionPanel;