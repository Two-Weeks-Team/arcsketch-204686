"use client";

import { useEffect, useRef, useState } from "react";
import { getCanvas, updateCanvas } from '@/lib/api';
import { useAutoSave } from '@/lib/hooks';

const Canvas = ({ project, setCanvasState }: { project: any; setCanvasState: (state: any) => void }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<any>(null);

  useEffect(() => {
    if (!project || !canvasRef.current) return;

    getCanvas(project.id)
      .then((data) => {
        const canvas = new window.fabric.Canvas(canvasRef.current, {
          width: 1920,
          height: 1080,
          backgroundColor: 'transparent',
        });

        data.objects.forEach((obj: any) => {
          if (obj.type === 'line') {
            canvas.add(new window.fabric.Line(obj.points, {
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth,
            }));
          } else if (obj.type === 'rect') {
            canvas.add(new window.fabric.Rect({
              left: obj.left,
              top: obj.top,
              width: obj.width,
              height: obj.height,
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth,
              fill: obj.fill,
            }));
          }
        });

        setCanvasState(data);

        canvas.on('mouse:down', (opt) => {
          const pointer = canvas.getPointer(opt.e);
          setLastPoint(pointer);
          setIsDrawing(true);
        });

        canvas.on('mouse:move', (opt) => {
          if (!isDrawing) return;
          const pointer = canvas.getPointer(opt.e);
          const line = new window.fabric.Line([lastPoint.x, lastPoint.y, pointer.x, pointer.y], {
            stroke: '#00ffcc',
            strokeWidth: 2,
          });
          canvas.add(line);
          canvas.renderAll();
          setLastPoint(pointer);
        });

        canvas.on('mouse:up', () => {
          setIsDrawing(false);
        });

        return () => {
          canvas.dispose();
        };
      })
      .catch((error) => console.error('Failed to load canvas:', error));
  }, [project, setCanvasState]);

  return <canvas ref={canvasRef} className="w-full h-full border border-border" />;
};

export default Canvas;