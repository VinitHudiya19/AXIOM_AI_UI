"use client";
import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Download, Image as ImageIcon, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

// SSR-safe: plotly.js requires window/document
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface PlotlySpec {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
}

/** Shape returned by viz-agent /chart endpoint */
interface SingleChartResult {
  spec: PlotlySpec;
  chart_type: string;
  color_scheme?: string;
  png_base64?: string;
  file_path?: string;
}

/** Shape returned by viz-agent /auto-insights endpoint */
interface AutoInsightsResult {
  total_requested?: number;
  total_generated?: number;
  charts: Array<{
    index: number;
    chart_type: string;
    task: string;
    spec: PlotlySpec | null;
    status: string;
    png_base64?: string;
    file_path?: string;
    error?: string;
  }>;
}

interface ChartWidgetProps {
  result: unknown;
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function isSingleChart(r: unknown): r is SingleChartResult {
  if (!r || typeof r !== "object") return false;
  const obj = r as Record<string, unknown>;
  if (!obj.spec || typeof obj.spec !== "object") return false;
  const spec = obj.spec as Record<string, unknown>;
  return Array.isArray(spec.data);
}

function isAutoInsights(r: unknown): r is AutoInsightsResult {
  if (!r || typeof r !== "object") return false;
  const obj = r as Record<string, unknown>;
  return Array.isArray(obj.charts);
}

function downloadPng(base64: string, filename: string) {
  const link = document.createElement("a");
  link.href = `data:image/png;base64,${base64}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadPlotlyAsImage(plotRef: HTMLDivElement | null, filename: string) {
  if (!plotRef) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Plotly = (window as any).Plotly;
  if (Plotly) {
    Plotly.downloadImage(plotRef, {
      format: "png",
      width: 1200,
      height: 700,
      filename: filename.replace(".png", ""),
    });
  }
}

/* ─── Single chart card ─────────────────────────────────────────────────────── */

function ChartCard({
  spec,
  chartType,
  task,
  pngBase64,
  index,
}: {
  spec: PlotlySpec | null;
  chartType: string;
  task?: string;
  pngBase64?: string;
  index: number;
}) {
  const [plotError, setPlotError] = useState(false);
  const plotContainerRef = useRef<HTMLDivElement>(null);
  const filename = `chart_${chartType}_${index + 1}.png`;

  const handleDownload = useCallback(() => {
    // Priority 1: download from PNG base64 (backend‑rendered, perfect quality)
    if (pngBase64) {
      downloadPng(pngBase64, filename);
      return;
    }
    // Priority 2: export from the live Plotly chart in the DOM
    downloadPlotlyAsImage(plotContainerRef.current?.querySelector(".js-plotly-plot") as HTMLDivElement | null, filename);
  }, [pngBase64, filename]);

  const canRenderPlotly = spec && Array.isArray(spec.data) && spec.data.length > 0 && !plotError;
  const hasPngFallback = !!pngBase64;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
          >
            {chartType}
          </span>
          {task && (
            <span
              className="text-xs truncate"
              style={{ color: "var(--text-muted)" }}
              title={task}
            >
              {task}
            </span>
          )}
        </div>

        {/* Download button */}
        {(canRenderPlotly || hasPngFallback) && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "var(--accent-muted)",
              color: "var(--accent)",
              border: "1px solid var(--accent-border, transparent)",
            }}
            title="Download chart as PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        )}
      </div>

      {/* Chart body */}
      <div ref={plotContainerRef}>
        {canRenderPlotly ? (
          <Plot
            data={spec!.data}
            layout={{
              ...spec!.layout,
              autosize: true,
              margin: {
                l: spec!.layout?.margin?.l ?? 60,
                r: spec!.layout?.margin?.r ?? 30,
                t: spec!.layout?.margin?.t ?? 80,
                b: spec!.layout?.margin?.b ?? 60,
              },
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ["lasso2d", "select2d"] as Plotly.ModeBarDefaultButtons[],
            }}
            style={{ width: "100%", minHeight: 420 }}
            useResizeHandler
            onError={() => setPlotError(true)}
          />
        ) : hasPngFallback ? (
          /* Fallback: display the backend-rendered PNG directly */
          <div className="relative">
            <div
              className="flex items-center gap-2 px-3 py-2 text-xs"
              style={{
                background: "rgba(234, 179, 8, 0.08)",
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
              <span>Interactive chart unavailable — showing server-rendered image</span>
            </div>
            <div className="flex items-center justify-center p-4" style={{ background: "var(--bg-surface)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${pngBase64}`}
                alt={`${chartType} chart${task ? `: ${task}` : ""}`}
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: 500 }}
              />
            </div>
          </div>
        ) : (
          /* No chart and no PNG — total failure */
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ImageIcon className="w-10 h-10" style={{ color: "var(--text-faint)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Chart could not be generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────────────────── */

export default function ChartWidget({ result }: ChartWidgetProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Case 1: Single chart result (from /chart or /run → /chart)
  if (isSingleChart(result)) {
    return (
      <ChartCard
        spec={result.spec}
        chartType={result.chart_type}
        pngBase64={result.png_base64}
        index={0}
      />
    );
  }

  // ── Case 2: Auto-insights result (from /auto-insights or /run → /auto-insights)
  if (isAutoInsights(result)) {
    const successCharts = result.charts.filter((c) => c.status === "success" || c.spec || c.png_base64);
    if (successCharts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          <ImageIcon className="w-10 h-10" style={{ color: "var(--text-faint)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No charts were generated successfully.
          </p>
        </div>
      );
    }

    // If only 1 chart, render directly without carousel
    if (successCharts.length === 1) {
      const c = successCharts[0];
      return (
        <ChartCard
          spec={c.spec}
          chartType={c.chart_type}
          task={c.task}
          pngBase64={c.png_base64}
          index={0}
        />
      );
    }

    // Multiple charts → carousel with controls
    const current = successCharts[activeIndex];
    return (
      <div className="space-y-3">
        {/* Carousel navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {successCharts.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: i === activeIndex ? "var(--accent-muted)" : "transparent",
                  color: i === activeIndex ? "var(--accent)" : "var(--text-muted)",
                  border: `1px solid ${i === activeIndex ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {c.chart_type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
              disabled={activeIndex === 0}
              className="p-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1" style={{ color: "var(--text-muted)" }}>
              {activeIndex + 1}/{successCharts.length}
            </span>
            <button
              onClick={() => setActiveIndex((p) => Math.min(successCharts.length - 1, p + 1))}
              disabled={activeIndex === successCharts.length - 1}
              className="p-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active chart */}
        <ChartCard
          spec={current.spec}
          chartType={current.chart_type}
          task={current.task}
          pngBase64={current.png_base64}
          index={activeIndex}
        />
      </div>
    );
  }

  // ── Case 3: Unknown structure — nothing to render
  return (
    <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>
      No chart data available.
    </p>
  );
}
