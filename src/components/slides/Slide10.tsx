import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

type SlotStatus = 'free' | 'occupied' | 'reserved';

const labelStatus: Record<SlotStatus, string> = {
  free: 'Libre',
  occupied: 'Ocupado',
  reserved: 'Reservado',
};

const nextStatus: Record<SlotStatus, SlotStatus> = {
  free: 'occupied',
  occupied: 'reserved',
  reserved: 'free',
};

const W = 30;
const H = 56;
const GAP_X = 8;

interface LayoutBlock {
  type: 'row' | 'column';
  prefix: string;
  x: number;
  y: number;
  count: number;
  statuses: SlotStatus[];
  angle: number;
}

const layout: LayoutBlock[] = [
  { type: 'row', prefix: 'A', x: 170, y: 40, count: 18, statuses: ['occupied','free','occupied','free','occupied','occupied','occupied','occupied','free','occupied','occupied','free','occupied','free','occupied','occupied','free','free'], angle: 0 },
  { type: 'row', prefix: 'B', x: 250, y: 150, count: 12, statuses: ['free','occupied','free','occupied','occupied','free','occupied','occupied','free','free','occupied','free'], angle: 0 },
  { type: 'row', prefix: 'C', x: 250, y: 255, count: 12, statuses: ['free','free','occupied','free','occupied','free','free','occupied','occupied','free','free','occupied'], angle: 0 },
  { type: 'row', prefix: 'D', x: 320, y: 370, count: 10, statuses: ['free','free','free','free','free','occupied','occupied','reserved','reserved','free'], angle: 0 },
  { type: 'row', prefix: 'E', x: 320, y: 435, count: 10, statuses: ['free','free','free','occupied','occupied','occupied','free','free','occupied','free'], angle: 0 },
  { type: 'row', prefix: 'F', x: 300, y: 585, count: 10, statuses: ['free','occupied','free','occupied','occupied','free','free','occupied','free','free'], angle: 0 },
  { type: 'column', prefix: 'L', x: 90, y: 170, count: 12, statuses: ['free','occupied','free','free','occupied','free','occupied','free','free','occupied','free','free'], angle: -12 },
  { type: 'column', prefix: 'R1', x: 760, y: 140, count: 13, statuses: ['occupied','free','free','occupied','occupied','free','occupied','free','occupied','free','free','occupied','free'], angle: 0 },
  { type: 'column', prefix: 'R2', x: 815, y: 140, count: 13, statuses: ['free','free','occupied','free','occupied','occupied','free','free','free','occupied','free','occupied','free'], angle: 0 },
];

function buildInitialSlots(): Record<string, SlotStatus> {
  const slots: Record<string, SlotStatus> = {};
  for (const block of layout) {
    for (let i = 0; i < block.count; i++) {
      const id = `${block.prefix}${String(i + 1).padStart(2, '0')}`;
      slots[id] = block.statuses[i] || 'free';
    }
  }
  return slots;
}

type StatusColorMap = Record<SlotStatus, string>;

export default function Slide10() {
  const [slots, setSlots] = useState<Record<string, SlotStatus>>(buildInitialSlots);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleClick = useCallback((id: string, current: SlotStatus) => {
    setSlots(prev => ({ ...prev, [id]: nextStatus[current] }));
    setSelectedSlot(id);
  }, []);

  const statusColors: StatusColorMap = {
    free: '#22c55e',
    occupied: '#ef4444',
    reserved: '#facc15',
  };

  const stats = {
    free: Object.values(slots).filter(s => s === 'free').length,
    occupied: Object.values(slots).filter(s => s === 'occupied').length,
    reserved: Object.values(slots).filter(s => s === 'reserved').length,
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-2 sm:mb-3 flex-shrink-0 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
          <span className="text-blue-400 uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm font-medium">Mapa Interactivo</span>
          <div className="h-1 w-6 sm:w-8 lg:w-12 bg-blue-500" />
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1">Estado de Estacionamientos</h2>
        <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400">
          Haz clic en cualquier espacio para cambiar su estado: Libre &rarr; Ocupado &rarr; Reservado
        </p>
      </motion.div>

      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 text-[10px] sm:text-xs">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm" style={{ backgroundColor: statusColors.free }} />
          <span className="text-slate-300">Libre ({stats.free})</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm" style={{ backgroundColor: statusColors.occupied }} />
          <span className="text-slate-300">Ocupado ({stats.occupied})</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm" style={{ backgroundColor: statusColors.reserved }} />
          <span className="text-slate-300">Reservado ({stats.reserved})</span>
        </span>
        {selectedSlot && (
          <span className="text-slate-500 ml-2">
            {selectedSlot}: <span className="font-medium text-white">{labelStatus[slots[selectedSlot]]}</span>
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-2xl w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 980 760"
            className="w-full h-full max-w-[min(90vh,56rem)]"
            style={{ background: '#ffffff', fontFamily: 'Arial, sans-serif' }}
          >
            {layout.map(block =>
              Array.from({ length: block.count }, (_, i) => {
                const id = `${block.prefix}${String(i + 1).padStart(2, '0')}`;
                const status = slots[id];
                const x = block.type === 'row'
                  ? block.x + i * (W + GAP_X)
                  : block.x;
                const y = block.type === 'column'
                  ? block.y + i * (H - 10)
                  : block.y;
                const cx = W / 2;
                const cy = H / 2;

                return (
                  <g
                    key={id}
                    transform={`translate(${x},${y}) rotate(${block.angle || 0},${cx},${cy})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClick(id, status)}
                  >
                    <rect
                      x={0}
                      y={0}
                      width={W}
                      height={H}
                      rx={5}
                      ry={5}
                      fill={statusColors[status]}
                      stroke="#334155"
                      strokeWidth={selectedSlot === id ? 2.2 : 1.5}
                      className="transition-all duration-100"
                    />
                    <title>{`${id} - ${labelStatus[status]}`}</title>
                  </g>
                );
              })
            )}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
