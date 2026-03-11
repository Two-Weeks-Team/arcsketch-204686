"use client";

import { useState } from "react";
import { createProject } from '@/lib/api';

const Hero = ({ projects, onSelectProject }: { projects: any[]; onSelectProject: (project: any) => void }) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async () => {
    try {
      const project = await createProject(newProjectName, 'Initial design');
      onSelectProject(project);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <header className="p-4 border-b border-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">ArcSketch</h1>
        <div>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            className="px-3 py-2 bg-muted text-foreground rounded mr-2"
          />
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-primary text-foreground rounded hover:bg-accent transition-colors"
          >
            Create
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl mb-2">Recent Projects</h2>
        <div className="grid grid-cols-2 gap-2">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="px-3 py-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Hero;