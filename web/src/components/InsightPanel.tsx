"use client";

import { useEffect, useState } from "react";
import { suggestMaterials } from '@/lib/api';

const InsightPanel = ({ project }: { project: any }) => {
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSuggest = async () => {
    try {
      const result = await suggestMaterials(project.id, selectedObjects, 'exterior façade');
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">AI Suggestions</h3>
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Select object IDs"
          value={selectedObjects.join(', ')}
          onChange={(e) => setSelectedObjects(e.target.value.split(',').map((id) => id.trim()))}
          className="flex-1 px-3 py-2 bg-muted text-foreground rounded mr-2"
        />
        <button
          onClick={handleSuggest}
          className="px-4 py-2 bg-primary text-foreground rounded hover:bg-accent transition-colors"
        >
          Suggest
        </button>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-2 bg-muted rounded">
            <p className="font-medium">Object {suggestion.object_id}</p>
            <p>Material: {suggestion.material}</p>
            <p>Code: {suggestion.code_reference}</p>
            <p>Confidence: {Math.round(suggestion.confidence * 100)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightPanel;