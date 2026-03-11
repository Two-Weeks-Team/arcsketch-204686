"use client";

import { useEffect, useState } from "react";
import { getProjects } from '@/lib/api';
import Hero from '@/components/Hero';
import Canvas from '@/components/Canvas';
import InsightPanel from '@/components/InsightPanel';
import CollectionPanel from '@/components/CollectionPanel';
import StatePanel from '@/components/StatePanel';
import ExportModal from '@/components/ExportModal';
import { useAutoSave } from '@/lib/hooks';

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [canvasState, setCanvasState] = useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState('idle');
  const [exportUrl, setExportUrl] = useState('');

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((error) => console.error('Failed to fetch projects:', error));
  }, []);

  useAutoSave(selectedProject, canvasState);

  const handleExport = async () => {
    setExportStatus('pending');
    try {
      const { export_id, status_url } = await exportFile(selectedProject, 'svg', 'mm', true, { project_name: selectedProject?.name });
      // Poll status_url to get download URL
      // Simulate for demo
      setTimeout(() => {
        setExportStatus('success');
        setExportUrl('https://example.com/exported.svg');
        setIsExportModalOpen(true);
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Hero projects={projects} onSelectProject={setSelectedProject} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          {selectedProject ? (
            <Canvas project={selectedProject} setCanvasState={setCanvasState} />
          ) : (
            <StatePanel state="empty" message="Select a project to start sketching." />
          )}
        </div>
        <div className="w-80 border-l border-border p-4 overflow-auto">
          {selectedProject && (
            <>
              <InsightPanel project={selectedProject} />
              <CollectionPanel project={selectedProject} />
              <button
                onClick={handleExport}
                className="mt-4 w-full py-2 px-4 bg-primary text-foreground rounded hover:bg-accent transition-colors"
              >
                Export to SVG
              </button>
            </>
          )}
        </div>
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        status={exportStatus}
        url={exportUrl}
      />
    </div>
  );
}