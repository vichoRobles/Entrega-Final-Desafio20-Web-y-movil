import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonRouterLink
} from '@ionic/react';
import api from "../api";

type TabId = "graficos" | "opiniones" | "proyectos";

// Coincide exactamente con el ENUM tipo_proyecto de la base de datos.
type TipoProyecto = "residencial" | "comercial" | "infraestructura" | "público";

const TIPO_LABELS: Record<TipoProyecto, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  infraestructura: "Infraestructura",
  "público": "Público",
};

type EstadoProyecto = "Planificado" | "En Progreso" | "Completado";

interface Project {
  id: number;
  nombre: string;
  tipo: TipoProyecto;
  descripcion: string;
  estado: EstadoProyecto;
  lat: number;
  lng: number;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  ubicacionTexto: string;
  responsable_id: number | null;
}

// Forma cruda tal como la entrega/espera la API REST (snake_case, lat/lng como string).
interface ApiProyecto {
  id: number;
  nombre: string;
  tipo: TipoProyecto;
  descripcion: string;
  estado: EstadoProyecto;
  lat: string | number;
  lng: string | number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  presupuesto: number | null;
  ubicacion_texto: string | null;
  responsable_id: number | null;
}

// API -> estado interno del componente.
function mapFromApi(row: ApiProyecto): Project {
  return {
    id: row.id,
    nombre: row.nombre,
    tipo: row.tipo,
    descripcion: row.descripcion,
    estado: row.estado,
    lat: Number(row.lat),
    lng: Number(row.lng),
    fechaInicio: row.fecha_inicio ? String(row.fecha_inicio).slice(0, 10) : "",
    fechaFin: row.fecha_fin ? String(row.fecha_fin).slice(0, 10) : "",
    presupuesto: row.presupuesto ?? 0,
    ubicacionTexto: row.ubicacion_texto ?? "",
    responsable_id: row.responsable_id ?? null,
  };
}

// Estado interno -> cuerpo que espera la API.
function mapToApi(data: Omit<Project, "id">) {
  return {
    nombre: data.nombre,
    tipo: data.tipo,
    descripcion: data.descripcion,
    estado: data.estado,
    lat: data.lat,
    lng: data.lng,
    fecha_inicio: data.fechaInicio || null,
    fecha_fin: data.fechaFin || null,
    presupuesto: data.presupuesto || 0,
    ubicacion_texto: data.ubicacionTexto || null,
  };
}

type TipoEmocion = "Alegría" | "Preocupación" | "Enojo";
type EstadoOpinion = "Recibida" | "En revisión" | "Resuelta";

interface Opinion {
  id: number;
  usuario_id: number;
  proyecto_id: number | null;
  emocion: TipoEmocion;
  descripcion: string;
  foto_url: string | null;
  estado: EstadoOpinion;
  categoria: string;
  fecha_registro: string;
}

const STATUS_STYLES: Record<EstadoProyecto, { bg: string; text: string; label: string }> = {
  "En Progreso": { bg: "bg-blue-100", text: "text-blue-700", label: "En Progreso" },
  Completado: { bg: "bg-green-100", text: "text-green-800", label: "Completado" },
  Planificado: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Planificado" },
};

const OPINIONES_INICIALES: Opinion[] = [
  {
    id: 1,
    usuario_id: 12,
    proyecto_id: 1,
    emocion: "Alegría",
    descripcion: "La repavimentación de la avenida ha mejorado mucho el tránsito en el sector.",
    foto_url: null,
    estado: "Recibida",
    categoria: "Infraestructura",
    fecha_registro: "2026-06-01T10:23:00",
  },
  {
    id: 2,
    usuario_id: 7,
    proyecto_id: 1,
    emocion: "Preocupación",
    descripcion: "Las obras generan mucho ruido en horarios nocturnos, afecta el descanso vecinal.",
    foto_url: null,
    estado: "En revisión",
    categoria: "Ruidos y Molestias",
    fecha_registro: "2026-06-03T08:45:00",
  },
  {
    id: 3,
    usuario_id: 21,
    proyecto_id: 2,
    emocion: "Alegría",
    descripcion: "La nueva plaza quedó excelente, los niños del barrio ya la están usando.",
    foto_url: null,
    estado: "Resuelta",
    categoria: "Espacios Públicos",
    fecha_registro: "2026-06-05T14:10:00",
  },
  {
    id: 4,
    usuario_id: 5,
    proyecto_id: 3,
    emocion: "Enojo",
    descripcion: "El consultorio sigue sin suficiente personal, la ampliación no sirve si no hay médicos.",
    foto_url: null,
    estado: "Recibida",
    categoria: "Salud",
    fecha_registro: "2026-06-08T09:00:00",
  },
  {
    id: 5,
    usuario_id: 33,
    proyecto_id: null,
    emocion: "Preocupación",
    descripcion: "Las luminarias del sector oriente llevan semanas apagadas, inseguridad en las noches.",
    foto_url: null,
    estado: "En revisión",
    categoria: "Seguridad",
    fecha_registro: "2026-06-10T19:30:00",
  },
];

const EMOTION_STYLES: Record<TipoEmocion, { bg: string; text: string }> = {
  Alegría: { bg: "bg-[#DCFCE7]", text: "text-[#15803D]" },
  Preocupación: { bg: "bg-[#FEF3C7]", text: "text-[#A16207]" },
  Enojo: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
};

const ESTADO_OPINION_STYLES: Record<EstadoOpinion, { bg: string; text: string }> = {
  Recibida: { bg: "bg-blue-50", text: "text-blue-700" },
  "En revisión": { bg: "bg-yellow-50", text: "text-yellow-700" },
  Resuelta: { bg: "bg-green-50", text: "text-green-700" },
};

type ChartDatum = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

type HoverInfo = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

// Datos actualizados con las etiquetas del mockup
const SENTIMENT_CHART_DATA: ChartDatum[] = [
  { label: "Alegría", count: 160, percentage: 52, color: "#3B82F6" },
  { label: "Preocupación", count: 100, percentage: 33, color: "#F59E0B" },
  { label: "Enojo", count: 46, percentage: 15, color: "#EF4444" },
];

const BAR_TICKS = [0, 40, 80, 120, 160];

function describePieSlice(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const startRadians = (Math.PI / 180) * startAngle;
  const endRadians = (Math.PI / 180) * endAngle;
  const startX = cx + radius * Math.cos(startRadians);
  const startY = cy + radius * Math.sin(startRadians);
  const endX = cx + radius * Math.cos(endRadians);
  const endY = cy + radius * Math.sin(endRadians);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${startX} ${startY}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    "Z",
  ].join(" ");
}

// 1. Gráfico de Barras Corregido
function SentimentBars({
  onHover,
  onClear,
}: {
  onHover: (info: HoverInfo) => void;
  onClear: () => void;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative h-[240px] w-full mt-6 mb-8">
      {/* Líneas de fondo y valores del eje Y */}
      <div className="absolute inset-x-0 top-0 bottom-0">
        {BAR_TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute left-8 right-0 border-t border-dashed border-[#E5EAF3]"
            style={{ bottom: `${(tick / 160) * 100}%` }}
          >
            <span className="absolute -left-8 -top-2.5 text-[12px] font-medium text-gray-400">
              {tick}
            </span>
          </div>
        ))}
      </div>

      {/* Barras */}
      <div className="absolute inset-x-8 top-0 bottom-0 flex items-end justify-around px-4 sm:px-12">
        {SENTIMENT_CHART_DATA.map((item, index) => {
          const barHeight = `${(item.count / 160) * 100}%`;

          return (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => onHover(item)}
              onMouseLeave={onClear}
              onFocus={() => onHover(item)}
              onBlur={onClear}
              className="group relative flex h-full flex-col items-center justify-end outline-none w-full max-w-[65px]"
            >
              <div
                className="w-full rounded-t-md shadow-sm transition-all duration-500 ease-out hover:opacity-80"
                style={{
                  height: barHeight,
                  backgroundColor: item.color,
                  transform: animate ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "bottom",
                  transitionDelay: `${index * 100}ms`,
                }}
              />
              {/* Etiquetas del eje X */}
              <span className="absolute -bottom-7 text-[13px] font-medium text-gray-500 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leyenda "Cantidad" movida más abajo para no chocar */}
      <div className="absolute -bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[13px] text-[#3B82F6]">
        <span className="h-3 w-3 rounded-sm bg-[#3B82F6]" />
        Cantidad
      </div>
    </div>
  );
}

// 2. Gráfico Circular Corregido (Más ancho para que no se corten los textos)
function SentimentPie({
  onHover,
  onClear,
}: {
  onHover: (info: HoverInfo) => void;
  onClear: () => void;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Centro y radios ajustados para un viewBox más amplio (500x260)
  const cx = 250; 
  const cy = 130;
  const radius = 95;
  const labelRadius = 155; 
  const total = SENTIMENT_CHART_DATA.reduce((sum, item) => sum + item.count, 0);

  let currentAngle = -90;

  return (
    <div className="relative h-[260px] w-full flex items-center justify-center mt-2 mb-4">
      {/* ViewBox ensanchado a 500 para dar espacio a los lados */}
      <svg viewBox="0 0 500 260" className="h-full w-full overflow-visible">
        {SENTIMENT_CHART_DATA.map((item, index) => {
          const sliceAngle = (item.count / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          currentAngle = endAngle;

          const midAngle = startAngle + sliceAngle / 2;
          const radians = (Math.PI / 180) * midAngle;
          
          const labelX = cx + labelRadius * Math.cos(radians);
          const labelY = cy + labelRadius * Math.sin(radians);
          
          const isRightSide = labelX >= cx;
          const textAnchor = isRightSide ? "start" : "end";
          const offsetX = isRightSide ? 8 : -8;

          return (
            <g key={item.label}>
              <path
                d={describePieSlice(cx, cy, radius, startAngle, endAngle)}
                fill={item.color}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="cursor-pointer transition-opacity duration-300 hover:opacity-80 outline-none"
                onMouseEnter={() => onHover(item)}
                onMouseLeave={onClear}
                onFocus={() => onHover(item)}
                onBlur={onClear}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transition: "transform 700ms ease",
                  transitionDelay: `${index * 100}ms`,
                  transform: animate ? "scale(1)" : "scale(0)",
                }}
              />
              <text
                x={labelX + offsetX}
                y={labelY}
                fill={item.color}
                fontSize="13"
                fontWeight="500"
                textAnchor={textAnchor}
                dominantBaseline="middle"
                style={{
                  opacity: animate ? 1 : 0,
                  transition: "opacity 700ms ease",
                  transitionDelay: `${index * 100 + 400}ms`,
                  pointerEvents: "none"
                }}
              >
                {item.label}: {item.percentage}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BrainIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path d="M16 6.66667C16.0016 6.13337 15.8965 5.60515 15.6909 5.11307C15.4854 4.62098 15.1835 4.17497 14.803 3.80126C14.4226 3.42755 13.9712 3.1337 13.4755 2.93697C12.9799 2.74025 12.4498 2.64464 11.9167 2.65575C11.3835 2.66686 10.8579 2.78448 10.3708 3.00169C9.88379 3.21889 9.44509 3.5313 9.08053 3.92054C8.71598 4.30977 8.43294 4.76798 8.24807 5.2682C8.06319 5.76843 7.98021 6.30057 8.004 6.83333C7.22027 7.03485 6.49267 7.41207 5.87631 7.93642C5.25994 8.46077 4.77098 9.1185 4.44646 9.8598C4.12193 10.6011 3.97034 11.4065 4.00318 12.2151C4.03602 13.0236 4.25242 13.8141 4.636 14.5267C3.96157 15.0746 3.43123 15.779 3.09112 16.5786C2.751 17.3782 2.61141 18.2488 2.68448 19.1146C2.75756 19.9805 3.04109 20.8154 3.5104 21.5467C3.97972 22.278 4.62062 22.8835 5.37733 23.3107C5.28389 24.0336 5.33965 24.7681 5.54118 25.4687C5.74271 26.1693 6.08573 26.8211 6.54904 27.3839C7.01236 27.9468 7.58614 28.4086 8.23496 28.741C8.88377 29.0734 9.59383 29.2692 10.3213 29.3164C11.0488 29.3637 11.7782 29.2612 12.4645 29.0155C13.1508 28.7697 13.7795 28.3859 14.3117 27.8877C14.8439 27.3895 15.2682 26.7874 15.5586 26.1188C15.849 25.4501 15.9992 24.729 16 24V6.66667Z" stroke="#155DFC" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6.66667C15.9984 6.13337 16.1035 5.60515 16.3091 5.11307C16.5146 4.62098 16.8165 4.17497 17.197 3.80126C17.5774 3.42755 18.0288 3.1337 18.5245 2.93697C19.0201 2.74025 19.5502 2.64464 20.0833 2.65575C20.6165 2.66686 21.1421 2.78448 21.6292 3.00169C22.1162 3.21889 22.5549 3.5313 22.9195 3.92054C23.284 4.30977 23.5671 4.76798 23.7519 5.2682C23.9368 5.76843 24.0198 6.30057 23.996 6.83333C24.7797 7.03485 25.5073 7.41207 26.1237 7.93642C26.7401 8.46077 27.229 9.1185 27.5535 9.8598C27.8781 10.6011 28.0297 11.4065 27.9968 12.2151C27.964 13.0236 27.7476 13.8141 27.364 14.5267C28.0384 15.0746 28.5688 15.779 28.9089 16.5786C29.249 17.3782 29.3886 18.2488 29.3155 19.1146C29.2424 19.9805 28.9589 20.8154 28.4896 21.5467C28.0203 22.278 27.3794 22.8835 26.6227 23.3107C26.7161 24.0336 26.6603 24.7681 26.4588 25.4687C26.2573 26.1693 25.9143 26.8211 25.451 27.3839C24.9876 27.9468 24.4139 28.4086 23.765 28.741C23.1162 29.0734 22.4062 29.2692 21.6787 29.3164C20.9512 29.3637 20.2218 29.2612 19.5355 29.0155C18.8492 28.7697 18.2205 28.3859 17.6883 27.8877C17.1561 27.3895 16.7318 26.7874 16.4414 26.1188C16.151 25.4501 16.0008 24.729 16 24V6.66667Z" stroke="#155DFC" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 17.3333C18.8806 16.9395 17.9031 16.2227 17.1911 15.2733C16.4791 14.324 16.0646 13.1849 16 12C15.9354 13.1849 15.5209 14.324 14.8089 15.2733C14.0969 16.2227 13.1194 16.9395 12 17.3333" stroke="#155DFC" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8" stroke="#155DFC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.25 1.75C12.5152 1.48478 12.8749 1.33578 13.25 1.33578C13.6251 1.33578 13.9848 1.48478 14.25 1.75C14.5152 2.01521 14.6642 2.37493 14.6642 2.75C14.6642 3.12507 14.5152 3.48478 14.25 3.75L8.24136 9.75933C8.08305 9.9175 7.88749 10.0333 7.67269 10.096L5.75735 10.656C5.69999 10.6727 5.63918 10.6737 5.58129 10.6589C5.52341 10.6441 5.47057 10.614 5.42832 10.5717C5.38607 10.5294 5.35595 10.4766 5.34112 10.4187C5.32629 10.3608 5.32729 10.3 5.34402 10.2427L5.90402 8.32733C5.96704 8.1127 6.08304 7.91737 6.24136 7.75933L12.25 1.75Z" stroke="#155DFC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3334 14.6667H4.66671C4.00004 14.6667 3.33337 14 3.33337 13.3333V4" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.33337 4.00001V2.66668C5.33337 2.00001 6.00004 1.33334 6.66671 1.33334H9.33337C10 1.33334 10.6667 2.00001 10.6667 2.66668V4.00001" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66663 7.33331V11.3333" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.33337 7.33331V11.3333" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FolderChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V8C22 7.46957 21.7893 6.96086 21.4142 6.58579C21.0391 6.21071 20.5304 6 20 6H12.07C11.7406 5.9983 11.4167 5.91525 11.1271 5.75824C10.8375 5.60123 10.5912 5.37512 10.41 5.1L9.59 3.9C9.40882 3.62488 9.1625 3.39877 8.8729 3.24176C8.58331 3.08475 8.25941 3.0017 7.93 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V18C2 19.1 2.9 20 4 20Z" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10V14" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 10V12" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10V16" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatCard({
  label,
  value,
  valueColor,
  icon,
}: {
  label: string;
  value: string;
  valueColor: string;
  icon: React.ReactNode;
}) {
  return (
    <IonCard className="m-0 h-full min-w-0 rounded-[14px] border border-[#E2E8F0] shadow-sm">
      <IonCardContent className="px-6 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-[#45556C]">{label}</span>
          <span className={`text-[30px] font-bold leading-9 ${valueColor}`}>{value}</span>
        </div>
        <div className="opacity-20">{icon}</div>
      </div>
      </IonCardContent>
    </IonCard>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 30C42 31.0609 41.5786 32.0783 40.8284 32.8284C40.0783 33.5786 39.0609 34 38 34H14L6 42V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H38C39.0609 6 40.0783 6.42143 40.8284 7.17157C41.5786 7.92172 42 8.93913 42 10V30Z" stroke="#2B7FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 14L27 31L17 21L4 34" stroke="#00C950" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 14H44V26" stroke="#00C950" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2V10" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7L8 10L11 7" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.33331 13H12.6666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Modal de Proyecto (Nuevo / Editar) ──────────────────────────────────────

type ModalMode = "create" | "edit";

const EMPTY_FORM: Omit<Project, "id"> = {
  nombre: "",
  tipo: "infraestructura",
  descripcion: "",
  estado: "Planificado",
  lat: 0,
  lng: 0,
  fechaInicio: "",
  fechaFin: "",
  presupuesto: 0,
  ubicacionTexto: "",
  responsable_id: null,
};

function ProjectModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: ModalMode;
  initial: Omit<Project, "id">;
  onClose: () => void;
  onSave: (data: Omit<Project, "id">) => Promise<void>;
}) {
  const [form, setForm] = useState<Omit<Project, "id">>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await onSave(form);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      setFormError(apiErrors?.[0]?.msg ?? err?.response?.data?.message ?? "No se pudo guardar el proyecto.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A58CA] focus:border-transparent transition";

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] mx-4"
        style={{ animation: "modalIn 0.18s ease" }}>
        <style>{`@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[18px] font-semibold text-[#0F172B]">
            {mode === "create" ? "Nuevo Proyecto" : "Editar Proyecto"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              Nombre del Proyecto <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Repavimentación Av. Los Carrera"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Tipo + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoProyecto })}
                className={inputClass}
              >
                {(["residencial","comercial","infraestructura","público"] as TipoProyecto[]).map((t) => (
                  <option key={t} value={t}>{TIPO_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoProyecto })}
                className={inputClass}
              >
                <option value="Planificado">Planificado</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe el proyecto municipal..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Ubicación texto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              Dirección / Sector
            </label>
            <input
              type="text"
              placeholder="Ej: Av. Los Carrera 1200, Quilpué"
              value={form.ubicacionTexto}
              onChange={(e) => setForm({ ...form, ubicacionTexto: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Latitud <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.000001"
                placeholder="-33.047200"
                value={form.lat || ""}
                onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Longitud <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.000001"
                placeholder="-71.442700"
                value={form.lng || ""}
                onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={form.fechaInicio}
                onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Fecha Fin
              </label>
              <input
                type="date"
                value={form.fechaFin}
                onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Presupuesto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              Presupuesto (CLP)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              value={form.presupuesto || ""}
              onChange={(e) => setForm({ ...form, presupuesto: parseInt(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>


          {/* Error del servidor */}
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[13px] text-red-700">
              {formError}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748B] bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#0A58CA] hover:bg-[#084298] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Guardando..." : mode === "create" ? "Crear Proyecto" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("graficos");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [opiniones, setOpiniones] = useState<Opinion[]>(OPINIONES_INICIALES);
  const [barHoverInfo, setBarHoverInfo] = useState<HoverInfo | null>(null);
  const [pieHoverInfo, setPieHoverInfo] = useState<HoverInfo | null>(null);
  const [chartAnimationKey, setChartAnimationKey] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalInitial, setModalInitial] = useState<Omit<Project, "id">>(EMPTY_FORM);

  // Trae los proyectos reales desde la API REST (GET /api/proyectos).
  const loadProjects = async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const { data } = await api.get('/proyectos');
      setProjects((data.data as ApiProyecto[]).map(mapFromApi));
    } catch (err: any) {
      setProjectsError(err?.response?.data?.message ?? "No se pudieron cargar los proyectos.");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setModalInitial(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setModalMode("edit");
    setEditingId(project.id);
    setModalInitial({
      nombre: project.nombre,
      tipo: project.tipo,
      descripcion: project.descripcion,
      estado: project.estado,
      lat: project.lat,
      lng: project.lng,
      fechaInicio: project.fechaInicio,
      fechaFin: project.fechaFin,
      presupuesto: project.presupuesto,
      ubicacionTexto: project.ubicacionTexto,
      responsable_id: project.responsable_id,
    });
    setModalOpen(true);
  };

  // Crea o actualiza contra la API. Si falla, el error se propaga al modal
  // (que lo muestra) y NO se cierra la ventana.
  const handleModalSave = async (data: Omit<Project, "id">) => {
    const body = mapToApi(data);
    if (modalMode === "create") {
      const { data: res } = await api.post('/proyectos', body);
      setProjects((prev) => [mapFromApi(res.data as ApiProyecto), ...prev]);
    } else if (editingId !== null) {
      const { data: res } = await api.put(`/proyectos/${editingId}`, body);
      const updated = mapFromApi(res.data as ApiProyecto);
      setProjects((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
    }
    setModalOpen(false);
  };

  useEffect(() => {
    if (activeTab === "graficos") {
      setChartAnimationKey((value) => value + 1);
    }
  }, [activeTab]);

  const handleDeleteOpinion = (id: number) => {
    setOpiniones((prev) => prev.filter((o) => o.id !== id));
  };

  const handleExportOpiniones = () => {
    const json = JSON.stringify(opiniones, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opiniones_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    setProjectsError(null);
    try {
      await api.delete(`/proyectos/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setProjectsError(err?.response?.data?.message ?? "No se pudo eliminar el proyecto.");
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "graficos", label: "Gráficos y Análisis" },
    { id: "opiniones", label: "Gestión Opiniones" },
    { id: "proyectos", label: "Gestión de Proyectos" },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="font-sans" style={{ '--background': '#F0F5F9' }}>
        <div className="min-h-full bg-[#F0F5F9] pb-12 relative">
          
          {/* Botón Volver */}
          <div className="absolute top-6 left-6">
            <IonRouterLink 
              routerLink="/login" 
              routerDirection="back" 
              className="flex flex-col items-center gap-0.5 text-[#0A58CA] hover:text-[#084298] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
              <span className="text-[15px] font-medium">Volver</span>
            </IonRouterLink>
          </div>

          <div className="max-w-[1100px] mx-auto pt-8 px-4 sm:px-6 lg:px-8">
            
            {/* Header del Panel */}
            <div className="bg-white rounded-[14px] shadow-sm py-5 px-8 mb-8 mt-10 w-full max-w-lg mx-auto text-center border border-gray-100 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-[#0A58CA]">
                <BrainIcon />
                <h1 className="text-[24px] font-medium leading-8 m-0">
                  Panel de Administración
                </h1>
              </div>
              <p className="text-[14px] text-[#555555] m-0">
                Análisis de sentimientos
              </p>
            </div>

            {/* Tarjetas Superiores */}
            <IonGrid className="mb-6 p-0 max-w-[800px] mx-auto">
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeMd="6" className="mb-4 mb-md-0 px-2">
                  <StatCard
                    label="Total Análisis"
                    value="300"
                    valueColor="text-[#0F172B]"
                    icon={<ChatBubbleIcon />}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" className="mb-4 mb-md-0 px-2">
                  <StatCard
                    label="Sentimiento Positivo"
                    value="52%"
                    valueColor="text-[#00C950]"
                    icon={<TrendingUpIcon />}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Pestañas / Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto max-w-[1000px] mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#0A58CA] text-[#0A58CA]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido de Gráficos */}
            {activeTab === "graficos" && (
              <IonGrid className="p-0 max-w-[1000px] mx-auto">
                <IonRow className="ion-justify-content-center">
                  
                  {/* Tarjeta Gráfico de Barras */}
                  <IonCol size="12" sizeLg="6" className="mb-4 mb-lg-0 px-2">
                    <IonCard className="m-0 h-full rounded-[14px] border border-[#E2E8F0] shadow-sm bg-white overflow-visible">
                      <IonCardContent className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                          <h2 className="text-[18px] font-medium leading-6 text-[#333333] max-w-[180px]">
                            Distribución de Sentimientos
                          </h2>
                          <div className="w-full xl:w-auto min-w-[200px]">
                            {barHoverInfo ? (
                              <div className="h-[80px] w-full max-w-[220px] rounded-xl border border-gray-200 bg-white px-4 py-2 flex flex-col justify-center shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: barHoverInfo.color }} />
                                  <span className="text-[15px] font-semibold text-gray-900">{barHoverInfo.label}</span>
                                </div>
                                <div className="flex items-center justify-between text-[13px] text-gray-600">
                                  <div className="flex flex-col">
                                    <span className="text-xs">Cantidad:</span>
                                    <strong className="text-gray-900">{barHoverInfo.count}</strong>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs">Porcentaje:</span>
                                    <strong className="text-gray-900">{barHoverInfo.percentage}%</strong>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-[80px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-center text-sm text-gray-500">
                                
                              </div>
                            )}
                          </div>
                        </div>

                        <SentimentBars
                          key={`bars-${chartAnimationKey}`}
                          onHover={setBarHoverInfo}
                          onClear={() => setBarHoverInfo(null)}
                        />
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  {/* Tarjeta Gráfico de Torta */}
                  <IonCol size="12" sizeLg="6" className="px-2">
                    <IonCard className="m-0 h-full rounded-[14px] border border-[#E2E8F0] shadow-sm bg-white overflow-visible">
                      <IonCardContent className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                          <h2 className="text-[18px] font-medium leading-6 text-[#333333] max-w-[180px]">
                            Proporción de Sentimientos
                          </h2>
                          <div className="w-full xl:w-auto min-w-[200px]">
                            {pieHoverInfo ? (
                              <div className="h-[80px] w-full max-w-[220px] rounded-xl border border-gray-200 bg-white px-4 py-2 flex flex-col justify-center shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pieHoverInfo.color }} />
                                  <span className="text-[15px] font-semibold text-gray-900">{pieHoverInfo.label}</span>
                                </div>
                                <div className="flex items-center justify-between text-[13px] text-gray-600">
                                  <div className="flex flex-col">
                                    <span className="text-xs">Cantidad:</span>
                                    <strong className="text-gray-900">{pieHoverInfo.count}</strong>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs">Porcentaje:</span>
                                    <strong className="text-gray-900">{pieHoverInfo.percentage}%</strong>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-[80px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-center text-sm text-gray-500">
                                
                              </div>
                            )}
                          </div>
                        </div>

                        <SentimentPie
                          key={`pie-${chartAnimationKey}`}
                          onHover={setPieHoverInfo}
                          onClear={() => setPieHoverInfo(null)}
                        />
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                </IonRow>
              </IonGrid>
            )}

            {/* Contenido de Gestión Opiniones */}
            {activeTab === "opiniones" && (
              <div className="max-w-[1000px] mx-auto px-2">
                <IonCard className="m-0 rounded-[14px] border border-[#E2E8F0] shadow-sm overflow-hidden">
                  <IonCardContent className="p-0">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
                      <h2 className="text-[20px] font-semibold leading-8 text-[#0F172B]">
                        Gestión Opiniones
                      </h2>
                      <button
                        onClick={handleExportOpiniones}
                        className="bg-[#0A58CA] hover:bg-[#084298] text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <ExportIcon />
                        Exportar JSON
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            {["ID", "Usuario", "Proyecto", "Emoción", "Descripción", "Categoría", "Estado", "Fecha", "Foto", "Acciones"].map((column) => (
                              <th
                                key={column}
                                className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em] leading-4 text-[#64748B] whitespace-nowrap"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {opiniones.map((op) => {
                            const emoStyle = EMOTION_STYLES[op.emocion];
                            const estadoStyle = ESTADO_OPINION_STYLES[op.estado];
                            const fechaFormatted = new Date(op.fecha_registro).toLocaleDateString("es-CL", {
                              day: "2-digit", month: "2-digit", year: "numeric"
                            });

                            return (
                              <tr key={op.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-[16px] text-sm font-normal text-[#0F172B] leading-5">
                                  #{op.id}
                                </td>
                                <td className="px-4 py-[16px] text-sm text-[#475569] leading-5 whitespace-nowrap">
                                  Usuario {op.usuario_id}
                                </td>
                                <td className="px-4 py-[16px] text-sm text-[#475569] leading-5 whitespace-nowrap">
                                  {op.proyecto_id !== null ? `#${op.proyecto_id}` : <span className="text-gray-400 italic">—</span>}
                                </td>
                                <td className="px-4 py-[16px]">
                                  <span className={`${emoStyle.bg} ${emoStyle.text} px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap inline-block`}>
                                    {op.emocion}
                                  </span>
                                </td>
                                <td className="px-4 py-[16px] text-sm font-normal text-[#475569] leading-5 min-w-[220px] max-w-[280px]">
                                  <span className="line-clamp-2">{op.descripcion}</span>
                                </td>
                                <td className="px-4 py-[16px] whitespace-nowrap">
                                  <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-[11px] font-medium">
                                    {op.categoria}
                                  </span>
                                </td>
                                <td className="px-4 py-[16px]">
                                  <span className={`${estadoStyle.bg} ${estadoStyle.text} px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap inline-block`}>
                                    {op.estado}
                                  </span>
                                </td>
                                <td className="px-4 py-[16px] text-sm text-[#475569] whitespace-nowrap">
                                  {fechaFormatted}
                                </td>
                                <td className="px-4 py-[16px] text-sm text-[#475569]">
                                  {op.foto_url
                                    ? <a href={op.foto_url} target="_blank" rel="noreferrer" className="text-[#0A58CA] underline text-xs">Ver foto</a>
                                    : <span className="text-gray-400 italic text-xs">Sin foto</span>
                                  }
                                </td>
                                <td className="px-4 py-[16px]">
                                  <button
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Eliminar opinión"
                                    onClick={() => handleDeleteOpinion(op.id)}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {opiniones.length === 0 && (
                            <tr>
                              <td colSpan={10} className="px-6 py-12 text-center text-sm text-[#45556C]">
                                No hay opiniones registradas.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {/* Contenido de Proyectos */}
            {activeTab === "proyectos" && (
              <div className="max-w-[1000px] mx-auto px-2">
                <IonCard className="m-0 rounded-[14px] border border-[#E2E8F0] shadow-sm overflow-hidden">
                  <IonCardContent className="p-0">
                    <div className="flex items-center justify-between px-6 py-6 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-3">
                        <FolderChartIcon />
                        <h2 className="text-[20px] font-semibold text-[#0F172B] leading-7">
                          Gestión de Proyectos
                        </h2>
                      </div>
                      <button onClick={openCreate} className="bg-[#0A58CA] hover:bg-[#084298] text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3.33337 8H12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 3.33334V12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Nuevo Proyecto
                      </button>
                    </div>

                    {projectsError && (
                      <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[13px] text-red-700">
                        {projectsError}
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            {["ID", "Proyecto", "Tipo", "Estado", "Ubicación", "Coords", "Presupuesto", "Acciones"].map((col) => (
                              <th
                                key={col}
                                className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-[0.06em] leading-4"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project) => {
                            const status = STATUS_STYLES[project.estado] ?? {
                              bg: "bg-gray-100",
                              text: "text-gray-700",
                              label: project.estado,
                            };
                            return (
                              <tr
                                key={project.id}
                                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-[20px] text-sm font-normal text-[#0F172B] leading-5">
                                  {project.id}
                                </td>
                                <td className="px-6 py-[20px] text-sm font-medium text-[#0F172B] leading-5 max-w-[180px]">
                                  <div className="font-medium text-[#0F172B]">{project.nombre}</div>
                                  {project.fechaInicio && (
                                    <div className="text-xs text-[#94A3B8] mt-0.5">{project.fechaInicio} → {project.fechaFin || "—"}</div>
                                  )}
                                </td>
                                <td className="px-6 py-[20px] whitespace-nowrap">
                                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[12px] font-medium">
                                    {TIPO_LABELS[project.tipo] ?? project.tipo}
                                  </span>
                                </td>
                                <td className="px-6 py-[20px]">
                                  <span className={`${status.bg} ${status.text} px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap`}>
                                    {status.label}
                                  </span>
                                </td>
                                <td className="px-6 py-[20px] text-sm font-normal text-[#45556C] leading-5 max-w-[160px] truncate" title={project.ubicacionTexto}>
                                  {project.ubicacionTexto || "—"}
                                </td>
                                <td className="px-6 py-[20px] text-xs font-mono text-[#45556C] whitespace-nowrap">
                                  <div>{project.lat.toFixed(4)}</div>
                                  <div>{project.lng.toFixed(4)}</div>
                                </td>
                                <td className="px-6 py-[20px] text-sm font-normal text-[#45556C] whitespace-nowrap">
                                  {project.presupuesto > 0
                                    ? `$${project.presupuesto.toLocaleString("es-CL")}`
                                    : "—"}
                                </td>
                                <td className="px-6 py-[20px]">
                                  <div className="flex items-center gap-2">
                                    <button className="p-1.5 text-gray-500 hover:text-[#0A58CA] hover:bg-[#E3EDFD] rounded-md transition-colors" title="Editar" onClick={() => openEdit(project)}>
                                      <EditIcon />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Eliminar" onClick={() => handleDelete(project.id)}>
                                      <DeleteIcon />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {projectsLoading && (
                            <tr>
                              <td colSpan={8} className="px-6 py-12 text-center text-sm text-[#45556C]">
                                Cargando proyectos...
                              </td>
                            </tr>
                          )}
                          {!projectsLoading && projects.length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-6 py-12 text-center text-sm text-[#45556C]">
                                No hay proyectos disponibles.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
            
          </div>
        </div>

        {/* Project Modal */}
        {modalOpen && (
          <ProjectModal
            mode={modalMode}
            initial={modalInitial}
            onClose={() => setModalOpen(false)}
            onSave={handleModalSave}
          />
        )}

      </IonContent>
    </IonPage>
  );
}