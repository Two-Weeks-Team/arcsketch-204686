import { useEffect, useState } from "react";
import { callInference } from './ai';

export const getProjects = async () => {
  const res = await fetch('/api/v1/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return await res.json();
};

export const createProject = async (name: string, description: string) => {
  const res = await fetch('/api/v1/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description })
  });
  if (!res.ok) throw new Error('Failed to create project');
  return await res.json();
};

export const getCanvas = async (projectId: string) => {
  const res = await fetch(`/api/v1/projects/${projectId}/canvas`);
  if (!res.ok) throw new Error('Failed to fetch canvas');
  return await res.json();
};

export const updateCanvas = async (projectId: string, canvasData: any) => {
  const res = await fetch(`/api/v1/projects/${projectId}/canvas`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(canvasData)
  });
  if (!res.ok) throw new Error('Failed to update canvas');
  return await res.json();
};

export const autoSnap = async (projectId: string, strokes: any[]) => {
  const res = await fetch(`/api/v1/projects/${projectId}/ai/snap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strokes })
  });
  if (!res.ok) throw new Error('Failed to auto-snap');
  return await res.json();
};

export const suggestMaterials = async (projectId: string, objectIds: string[], context: string) => {
  const res = await fetch(`/api/v1/projects/${projectId}/ai/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ object_ids: objectIds, context })
  });
  if (!res.ok) throw new Error('Failed to suggest materials');
  return await res.json();
};

export const exportFile = async (projectId: string, format: string, units: string, includeLayers: boolean, metadata: any) => {
  const res = await fetch(`/api/v1/projects/${projectId}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, units, include_layers: includeLayers, metadata })
  });
  if (!res.ok) throw new Error('Failed to initiate export');
  return await res.json();
};

export const useAutoSave = (projectId: string | null, canvasState: any | null) => {
  useEffect(() => {
    if (!projectId || !canvasState) return;

    const interval = setInterval(async () => {
      try {
        await updateCanvas(projectId, { add: canvasState });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [projectId, canvasState]);
};