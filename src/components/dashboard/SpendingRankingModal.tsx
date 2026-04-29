import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

type TimeRange = '7days' | '30days';

type ModelTimeSeriesData = {
  modelId: string;
  modelName: string;
  color: string;
  data: { date: string; value: number }[];
  total: number;
  avg: number;
  max: number;
  min: number;
};

export function SpendingRankingModal({ onClose }: { onClose: () => void }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ modelId: string; index: number } | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ modelId: string; index: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; model: string; date: string; value: number; color: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset selection when switching tabs
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setSelectedPoint(null);
    setHoveredPoint(null);
    setHoveredModel(null);
    setTooltip(null);
  };

  // Generate mock data for the last 30 days
  const generateDateLabels = (days: number): string[] => {
    const labels: string[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    return labels;
  };

  const dateLabels = generateDateLabels(30);

  // Mock time series data for each model
  const modelData: ModelTimeSeriesData[] = [
    {
      modelId: 'gemini-3-1-pro',
      modelName: 'Gemini 3.1 Pro',
      color: '#9d82f5',
      data: dateLabels.map((date, i) => ({
        date,
        value: [8.5, 12.3, 6.7, 15.2, 9.8, 11.5, 7.3, 13.1, 8.9, 10.4, 14.2, 6.8, 9.5, 11.7, 8.2, 12.9, 7.6, 10.1, 13.5, 9.3, 8.7, 11.2, 14.8, 6.9, 10.5, 9.1, 12.4, 7.8, 11.6, 8.3][i] || Math.random() * 10 + 5,
      })),
      total: 298.5, avg: 9.95, max: 15.2, min: 6.7,
    },
    {
      modelId: 'qwen3-6-plus',
      modelName: 'Qwen3.6 Plus',
      color: '#a855f7',
      data: dateLabels.map((date, i) => ({
        date,
        value: [5.2, 7.8, 4.1, 9.5, 6.3, 8.1, 5.7, 7.9, 6.2, 8.4, 9.1, 4.8, 6.7, 7.3, 5.9, 8.6, 5.1, 7.2, 8.8, 6.4, 5.6, 7.7, 9.3, 4.5, 6.8, 6.1, 8.2, 5.4, 7.5, 5.8][i] || Math.random() * 6 + 3,
      })),
      total: 196.8, avg: 6.56, max: 9.5, min: 4.1,
    },
    {
      modelId: 'claude-haiku-4-5',
      modelName: 'Claude Haiku 4.5',
      color: '#b36cf7',
      data: dateLabels.map((date, i) => ({
        date,
        value: [3.8, 5.5, 2.9, 6.8, 4.2, 5.9, 3.5, 5.1, 4.5, 6.2, 6.9, 3.2, 4.8, 5.4, 4.1, 6.3, 3.7, 5.0, 6.5, 4.6, 4.0, 5.6, 6.7, 3.1, 4.9, 4.3, 5.8, 3.9, 5.3, 4.2][i] || Math.random() * 4 + 2,
      })),
      total: 145.6, avg: 4.85, max: 6.9, min: 2.9,
    },
    {
      modelId: 'glm-5-1',
      modelName: 'GLM 5.1',
      color: '#be83f9',
      data: dateLabels.map((date, i) => ({
        date,
        value: [2.5, 4.1, 1.8, 5.2, 3.0, 4.3, 2.7, 3.9, 3.2, 4.5, 5.1, 2.1, 3.5, 4.0, 2.9, 4.6, 2.4, 3.7, 4.8, 3.3, 2.8, 4.0, 5.0, 2.0, 3.6, 3.1, 4.2, 2.6, 3.8, 2.9][i] || Math.random() * 3 + 1.5,
      })),
      total: 102.4, avg: 3.41, max: 5.2, min: 1.8,
    },
    {
      modelId: 'gpt-5-3-codex',
      modelName: 'GPT-5.3 Codex',
      color: '#c99afb',
      data: dateLabels.map((date, i) => ({
        date,
        value: [4.2, 6.8, 3.5, 8.1, 5.2, 6.5, 4.6, 6.9, 5.3, 7.1, 7.8, 3.9, 5.5, 6.3, 4.8, 7.2, 4.1, 5.9, 7.4, 5.1, 4.5, 6.4, 7.6, 3.7, 5.7, 5.0, 6.7, 4.3, 6.1, 4.7][i] || Math.random() * 5 + 2.5,
      })),
      total: 167.3, avg: 5.58, max: 8.1, min: 3.5,
    },
  ];

  const displayData = timeRange === '7days'
    ? modelData.map(m => ({ ...m, data: m.data.slice(-7) }))
    : modelData;

  const filteredData = displayData;

  // Chart dimensions
  const chartWidth = 840;
  const chartHeight = 320;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scales
  const allValues = filteredData.flatMap(m => m.data.map(d => d.value));
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = 0;

  const xScale = (index: number) => padding.left + (index / (filteredData[0]?.data.length - 1 || 1)) * graphWidth;
  const yScale = (value: number) => padding.top + graphHeight - ((value - minValue) / (maxValue - minValue)) * graphHeight;

  // Generate path for each model
  const generatePath = (data: { date: string; value: number }[]) => {
    return data.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: { date: string; value: number }[]) => {
    const linePath = generatePath(data);
    const lastX = xScale(data.length - 1);
    const firstX = xScale(0);
    const bottomY = padding.top + graphHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Smart snap mechanism
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const allPoints: {
      modelId: string; modelName: string; modelColor: string;
      index: number; x: number; y: number; value: number; date: string;
    }[] = [];

    filteredData.forEach(model => {
      model.data.forEach((d, i) => {
        allPoints.push({
          modelId: model.modelId, modelName: model.modelName, modelColor: model.color,
          index: i, x: xScale(i), y: yScale(d.value), value: d.value, date: d.date,
        });
      });
    });

    // Priority 1: If a node is selected, prioritize horizontal snap within same model
    if (selectedPoint) {
      const selectedModelPoints = allPoints.filter(p => p.modelId === selectedPoint.modelId);
      if (selectedModelPoints.length > 0) {
        const modelMinY = Math.min(...selectedModelPoints.map(p => p.y)) - 40;
        const modelMaxY = Math.max(...selectedModelPoints.map(p => p.y)) + 40;

        if (mouseY >= modelMinY && mouseY <= modelMaxY) {
          let nearestPoint = selectedModelPoints[0];
          let minDistance = Infinity;

          selectedModelPoints.forEach(point => {
            const dx = mouseX - point.x;
            const dy = mouseY - point.y;
            const distance = Math.abs(dx) * 0.3 + Math.abs(dy) * 1.5;
            if (distance < minDistance) { minDistance = distance; nearestPoint = point; }
          });

          if (minDistance <= 60) {
            setHoveredModel(nearestPoint.modelId);
            setHoveredPoint({ modelId: nearestPoint.modelId, index: nearestPoint.index });
            setTooltip({ x: nearestPoint.x, y: nearestPoint.y, model: nearestPoint.modelName, date: nearestPoint.date, value: nearestPoint.value, color: nearestPoint.modelColor });
            return;
          }
        }
      }
    }

    // Priority 2: Direct node hover
    let directHitPoint: typeof allPoints[0] | null = null;
    let directHitDistance = Infinity;

    allPoints.forEach(point => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < directHitDistance && distance <= 20) { directHitDistance = distance; directHitPoint = point; }
    });

    if (directHitPoint) {
      setHoveredModel(directHitPoint.modelId);
      setHoveredPoint({ modelId: directHitPoint.modelId, index: directHitPoint.index });
      setTooltip({ x: directHitPoint.x, y: directHitPoint.y, model: directHitPoint.modelName, date: directHitPoint.date, value: directHitPoint.value, color: directHitPoint.modelColor });
      return;
    }

    // Priority 3: General proximity snap
    let nearestPoint = allPoints[0];
    let minDistance = Infinity;

    allPoints.forEach(point => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) { minDistance = distance; nearestPoint = point; }
    });

    if (minDistance <= 50) {
      setHoveredModel(nearestPoint.modelId);
      setHoveredPoint({ modelId: nearestPoint.modelId, index: nearestPoint.index });
      setTooltip({ x: nearestPoint.x, y: nearestPoint.y, model: nearestPoint.modelName, date: nearestPoint.date, value: nearestPoint.value, color: nearestPoint.modelColor });
    } else {
      setHoveredPoint(null);
      setTooltip(null);
    }
  };

  const handlePointClick = (model: ModelTimeSeriesData, pointIndex: number) => {
    setSelectedPoint({ modelId: model.modelId, index: pointIndex });
    setHoveredModel(model.modelId);
    setHoveredPoint({ modelId: model.modelId, index: pointIndex });

    const dataPoint = model.data[pointIndex];
    if (dataPoint) {
      setTooltip({ x: xScale(pointIndex), y: yScale(dataPoint.value), model: model.modelName, date: dataPoint.date, value: dataPoint.value, color: model.color });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[960px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">模型費用趨勢</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {(['7days', '30days'] as const).map(range => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                  timeRange === range ? 'bg-[#9d82f5] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {range === '7days' ? '最近7天' : '最近30天'}
              </button>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="px-5 py-4">
          <div className="relative" style={{ width: chartWidth, height: chartHeight }}>
            <svg
              ref={svgRef}
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible cursor-crosshair"
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={() => { setHoveredModel(null); setHoveredPoint(null); setTooltip(null); }}
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padding.top + graphHeight * ratio;
                const value = maxValue * (1 - ratio);
                return (
                  <g key={i}>
                    <line x1={padding.left} y1={y} x2={padding.left + graphWidth} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
                    <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="11">{value.toFixed(0)}</text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {filteredData[0]?.data.map((d, i) => {
                const showLabel = timeRange === '7days' ? true : i % 5 === 0 || i === filteredData[0].data.length - 1;
                if (!showLabel) return null;
                return (
                  <text key={i} x={xScale(i)} y={chartHeight - 15} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">{d.date}</text>
                );
              })}

              {/* Area fills */}
              {filteredData.map((model) => (
                <path
                  key={`area-${model.modelId}`}
                  d={generateAreaPath(model.data)}
                  fill={model.color}
                  opacity={hoveredModel === model.modelId ? 0.15 : hoveredModel ? 0.03 : 0.08}
                  className="transition-opacity duration-200"
                />
              ))}

              {/* Lines */}
              {filteredData.map((model) => (
                <path
                  key={`line-${model.modelId}`}
                  d={generatePath(model.data)}
                  fill="none"
                  stroke={model.color}
                  strokeWidth={hoveredModel === model.modelId ? 3 : 2}
                  opacity={hoveredModel === model.modelId ? 1 : hoveredModel ? 0.3 : 0.8}
                  className="transition-all duration-200"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Vertical guide line */}
              {hoveredPoint && (() => {
                const model = filteredData.find(m => m.modelId === hoveredPoint.modelId);
                if (!model) return null;
                const x = xScale(hoveredPoint.index);
                return (
                  <line x1={x} y1={padding.top} x2={x} y2={padding.top + graphHeight} stroke="rgba(255,255,255,0.1)" strokeDasharray="4,4" className="pointer-events-none" />
                );
              })()}

              {/* Data points with enhanced interaction */}
              {filteredData.map((model) =>
                model.data.map((d, i) => {
                  const isHovered = hoveredPoint?.modelId === model.modelId && hoveredPoint?.index === i;
                  const isModelHovered = hoveredModel === model.modelId;
                  const showPoint = isHovered || isModelHovered || !hoveredModel;
                  const isSelected = selectedPoint?.modelId === model.modelId && selectedPoint?.index === i;

                  return (
                    <g key={`point-group-${model.modelId}-${i}`}>
                      {isSelected && (
                        <circle cx={xScale(i)} cy={yScale(d.value)} r={14} fill="none" stroke={model.color} strokeWidth={2} strokeDasharray="4,4" opacity={0.6} className="pointer-events-none" />
                      )}
                      {isHovered && (
                        <circle cx={xScale(i)} cy={yScale(d.value)} r={10} fill={model.color} opacity={0.2} className="pointer-events-none" />
                      )}
                      <circle
                        cx={xScale(i)} cy={yScale(d.value)}
                        r={isHovered ? 6 : isModelHovered ? 4 : 3}
                        fill={isHovered ? '#fff' : model.color}
                        stroke={model.color} strokeWidth={isHovered ? 3 : 2}
                        opacity={showPoint ? 1 : 0.4}
                        className="cursor-pointer"
                        onClick={() => handlePointClick(model, i)}
                      />
                    </g>
                  );
                })
              )}
            </svg>

            {/* Enhanced Tooltip */}
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute pointer-events-none rounded-xl px-4 py-3 shadow-2xl z-10"
                style={{
                  left: tooltip.x, top: tooltip.y,
                  transform: 'translate(-50%, -120%)',
                  background: 'linear-gradient(135deg, rgba(26,26,30,0.95) 0%, rgba(26,26,30,0.98) 100%)',
                  border: `1px solid ${tooltip.color}40`,
                  boxShadow: `0 8px 32px ${tooltip.color}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tooltip.color }} />
                  <span className="text-xs text-white/60 font-medium">{tooltip.date}</span>
                </div>
                <div className="text-sm text-white font-semibold mb-0.5">{tooltip.model}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold" style={{ color: tooltip.color }}>{tooltip.value.toFixed(2)}</span>
                  <span className="text-xs text-white/40">Credit</span>
                </div>
                <div
                  className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45"
                  style={{
                    backgroundColor: 'rgba(26,26,30,0.95)',
                    borderRight: `1px solid ${tooltip.color}40`,
                    borderBottom: `1px solid ${tooltip.color}40`,
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="px-5 py-4 border-t border-white/5">
          <div className="grid grid-cols-5 gap-3">
            {filteredData.map((model) => (
              <div
                key={model.modelId}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  hoveredModel === model.modelId
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/8'
                }`}
                onMouseEnter={() => setHoveredModel(model.modelId)}
                onMouseLeave={() => setHoveredModel(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                  <span className="text-xs text-white font-medium truncate">{model.modelName}</span>
                </div>
                <div className="space-y-1">
                  {[
                    { label: '總計', value: model.total.toFixed(1) },
                    { label: '平均', value: model.avg.toFixed(1) },
                    { label: '最高', value: model.max.toFixed(1) },
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between text-[11px]">
                      <span className="text-white/40">{stat.label}</span>
                      <span className="text-white/70">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
