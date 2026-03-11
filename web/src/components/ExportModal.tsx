"use client";

import { useState } from "react";

const ExportModal = ({
  isOpen,
  onClose,
  status = 'idle',
  url = ''
}: {
  isOpen: boolean;
  onClose: () => void;
  status?: 'idle' | 'pending' | 'success' | 'error';
  url?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Export Status</h2>
        <div>
          {status === 'idle' && <p>Ready to export.</p>}
          {status === 'pending' && (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              <p>Exporting...</p>
            </div>
          )}
          {status === 'success' && (
            <div>
              <p className="text-success mb-2">Export completed successfully!</p>
              {url && (
                <a
                  href={url}
                  download
                  className="text-primary hover:underline inline-flex items-center"
                >
                  <span>Download SVG</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                  </svg>
                </a>
              )}
            </div>
          )}
          {status === 'error' && <p className="text-red-500">Export failed. Please try again.</p>}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-muted text-foreground rounded hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;