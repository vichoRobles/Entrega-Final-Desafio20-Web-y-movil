import { useEffect, useRef, useState } from "react";
import { IonContent, IonPage, IonRouterLink } from "@ionic/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PROJECT_TYPES = ["residencial", "comercial", "infraestructura", "público"] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

// Matches the DB schema (columns: id, nombre, tipo, descripcion, estado, lat, lng)
interface ProjectRaw {
  id: number;
  nombre: string;
  tipo: ProjectType;
  descripcion: string;
  estado: string;
  lat: number;
  lng: number;
}

interface Project {
  id: number;
  name: string;
  type: ProjectType;
  description: string;
  status: string;
  lat: number;
  lng: number;
}

function mapRawProject(raw: ProjectRaw): Project {
  return {
    id: raw.id,
    name: raw.nombre,
    type: raw.tipo,
    description: raw.descripcion,
    status: raw.estado,
    lat: Number(raw.lat),
    lng: Number(raw.lng),
  };
}

const API_BASE = "http://localhost:3000/api/proyectos";

function createRedMarkerIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="100%" height="100%" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
      <g filter="url(#shadow)">
        <path d="M26.6666 13.3333C26.6666 19.9907 19.2813 26.924 16.8013 29.0653C16.5703 29.2391 16.289 29.333 16 29.333C15.7109 29.333 15.4297 29.2391 15.1986 29.0653C12.7186 26.924 5.33331 19.9907 5.33331 13.3333C5.33331 10.5043 6.45712 7.79124 8.45751 5.79085C10.4579 3.79046 13.171 2.66666 16 2.66666C18.829 2.66666 21.5421 3.79046 23.5425 5.79085C25.5428 7.79124 26.6666 10.5043 26.6666 13.3333Z" fill="#E7000B" stroke="#CC0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 17.3333C18.2091 17.3333 20 15.5425 20 13.3333C20 11.1242 18.2091 9.33334 16 9.33334C13.7909 9.33334 12 11.1242 12 13.3333C12 15.5425 13.7909 17.3333 16 17.3333Z" fill="#8B0000" />
      </g>
    </svg>`,
    iconSize: [56, 70],
    iconAnchor: [28, 70],
    popupAnchor: [0, -60],
  });
}

export default function Index() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<ProjectType>>(
    new Set(PROJECT_TYPES)
  );
  const [zoom, setZoom] = useState(14);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch projects from the backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setFetchError(null);
        const res = await fetch(`${API_BASE}/`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const json = await res.json();
        const mapped: Project[] = (json.data as ProjectRaw[]).map(mapRawProject);
        setProjects(mapped);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Error al cargar proyectos");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-33.630, -71.625],
      zoom: 14,
      zoomControl: false, 
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on("zoomend", () => {
      setZoom(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || loadingProjects) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const icon = createRedMarkerIcon();

    projects.filter((p) => selectedTypes.has(p.type)).forEach((project) => {
      const marker = L.marker([project.lat, project.lng], { icon }).addTo(map);
      marker.on("click", () => setSelectedProject(project));
      markersRef.current.push(marker);
    });
  }, [selectedTypes, projects, loadingProjects]);

  const toggleType = (type: ProjectType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedTypes(new Set(PROJECT_TYPES));
  const clearAll = () => setSelectedTypes(new Set());

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  return (
    <IonPage>
      <IonContent fullscreen className="font-sans">
        <div className="relative h-screen w-screen bg-[#E5E5E5] overflow-hidden">
          
          {/* Contenedor del Mapa */}
          <div ref={mapContainerRef} className="absolute inset-0 z-0" />

          {/* Overlay de carga / error */}
          {(loadingProjects || fetchError) && (
            <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-md flex items-center gap-3">
                {loadingProjects && !fetchError && (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0054E9" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">Cargando proyectos…</span>
                  </>
                )}
                {fetchError && (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E7000B" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <span className="text-sm text-red-600 font-medium">{fetchError}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Botón flotante para reabrir el menú */}
          {!isMenuOpen && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-[#0054E9] hover:bg-gray-50 transition-colors"
              aria-label="Abrir filtros"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 6H21M3 12H21M3 18H21" />
              </svg>
            </button>
          )}

          {/* Panel Lateral Flotante y Desplegable */}
          <div 
            className={`absolute top-4 bottom-4 left-4 w-[300px] bg-white rounded-2xl shadow-xl z-[1001] flex flex-col py-6 px-5 overflow-y-auto transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "-translate-x-[120%] shadow-none"
            }`}
          >
            {/* Cabecera del Panel */}
            <div className="flex justify-between items-center mb-8">
              <IonRouterLink
                routerLink="/login"
                routerDirection="back"
                className="flex items-center gap-2 text-[#0054E9] text-xl font-medium hover:opacity-80"
              >
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 18L2 10L10 2" />
                </svg>
                Volver
              </IonRouterLink>
              <button onClick={() => setIsMenuOpen(false)} className="text-[#0054E9] hover:opacity-80" aria-label="Cerrar filtros">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Título Filtros */}
            <div className="flex items-center gap-2 mb-4 text-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <h2 className="text-xl font-semibold">Filtros</h2>
            </div>

            {/* Acciones de Selección */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={selectAll} className="text-[#0054E9] text-sm font-medium hover:underline">
                Seleccionar todos
              </button>
              <button onClick={clearAll} className="text-[#0054E9] text-sm font-medium hover:underline">
                Limpiar
              </button>
            </div>

            {/* Lista de Tipos con Checkboxes */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-black mb-3">Tipo de proyecto</h3>
              <ul className="flex flex-col gap-3 pl-1">
                {PROJECT_TYPES.map((type) => (
                  <li key={type} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`filter-${type}`}
                      checked={selectedTypes.has(type)}
                      onChange={() => toggleType(type)}
                      className="w-4 h-4 accent-[#0054E9] cursor-pointer"
                    />
                    <label 
                      htmlFor={`filter-${type}`}
                      className={`cursor-pointer capitalize text-sm transition-colors select-none ${
                        selectedTypes.has(type) ? "text-black font-medium" : "text-gray-500"
                      }`}
                    >
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón de Opiniones Enviadas*/}
            <div className="mt-8 mb-4">
              <IonRouterLink
                routerLink="/opinions"
                routerDirection="forward"
                className="flex items-center justify-center gap-2.5 w-full bg-[#E3EDFD] text-[#0054E9] font-medium text-[14px] py-3 rounded-[10px] hover:bg-[#d0e0fa] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Seguimiento de opiniones
              </IonRouterLink>
            </div>

            {/* Contador Inferior */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {selectedTypes.size} tipos seleccionados
              </p>
            </div>
          </div>

          {/* Tarjeta de Detalles del Proyecto */}
          {selectedProject && (
            <div 
              className={`absolute top-10 w-[320px] bg-white rounded-xl shadow-lg z-[1000] p-4 border border-gray-100 transition-all duration-300 ease-in-out ${
                isMenuOpen ? "left-[340px]" : "left-20"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[#0054E9] font-medium text-[15px] leading-tight pr-6">
                  {selectedProject.name}
                </h3>
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="text-gray-400 hover:text-gray-600 absolute right-4 top-4"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-[13px] capitalize mb-1">
                {selectedProject.type}
              </p>
              <p className="text-black text-[13px] mb-4">
                {selectedProject.description}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="bg-[#188038] text-white text-[12px] font-medium px-3 py-1 rounded-md">
                  {selectedProject.status}
                </span>
                <IonRouterLink
                  routerLink="/detalles"
                  className="text-[#0054E9] text-[13px] font-medium hover:underline"
                >
                  Detalles del proyecto
                </IonRouterLink>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2 pointer-events-none transition-all duration-300">
            <span className="text-[#0054E9] text-[13px] font-medium">Mapa Interactivo</span>
            <div className="w-px h-3 bg-gray-300"></div>
            <span className="text-gray-500 text-[12px]">Zoom: {zoom}</span>
          </div>

          {/* Controles de Zoom (Abajo a la derecha) */}
          <div className="absolute bottom-10 right-6 z-[1000] flex flex-col gap-2">
            <button 
              onClick={handleZoomIn} 
              className="w-10 h-10 bg-white rounded-lg shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Acercar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button 
              onClick={handleZoomOut} 
              className="w-10 h-10 bg-white rounded-lg shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Alejar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}