import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";

export function useDnDSensors() {
  return useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );
}

export function useDragHighlight() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    document.body.style.overflow = "hidden";
  };

  const onDragEnd = ({}: DragEndEvent) => {
    document.body.style.overflow = "";
    setActiveId(null);
  };

  return { activeId, onDragStart, onDragEnd };
}
