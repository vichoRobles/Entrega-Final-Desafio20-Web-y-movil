import { useState } from "react";
import { IonContent, IonPage, IonRouterLink } from '@ionic/react';

const REGIONES_CHILE = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana de Santiago",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén del General Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena",
];

const COMUNAS: Record<string, string[]> = {
  "Región Metropolitana de Santiago": [
    "Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "La Florida",
    "Puente Alto", "San Bernardo", "Quilicura", "Recoleta", "Independencia",
  ],
  "Región de Valparaíso": [
    "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Con-Con",
  ],
  "Región del Biobío": [
    "Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Hualpén",
  ],
  "Región de La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"],
  "Región de Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud"],
  "Región de Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
  "Región de Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
  "Región de Atacama": ["Copiapó", "Vallenar", "Chañaral", "Caldera"],
  "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte"],
  "Región de Arica y Parinacota": ["Arica", "Putre", "Camarones"],
  "Región del Maule": ["Talca", "Curicó", "Linares", "Constitución"],
  "Región de Ñuble": ["Chillán", "San Carlos", "Bulnes", "Coihueco"],
  "Región de Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Lago Ranco"],
  "Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Puerto Aysén", "Cochrane"],
  "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir"],
  "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "San Fernando", "Rengo", "Pichilemu"],
};

export default function Index() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    rut: "",
    correo: "",
    region: "",
    comuna: "",
    contrasena: "",
    confirmarContrasena: "",
    aceptaTerminos: false,
  });

  const comunasDisponibles = formData.region ? (COMUNAS[formData.region] ?? []) : [];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => {
        const updated: typeof prev = { ...prev, [name]: value };
        if (name === "region") updated.comuna = "";
        return updated;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle registration logic here
  }

  return (
    <IonPage>
      <IonContent fullscreen className="font-sans">
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F5F9] py-10 px-4 relative">
          
          {/* Botón Volver (Esquina superior izquierda) */}
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

          {/* Tarjeta del Formulario */}
          <div className="w-full max-w-[440px] bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
            
            {/* Título */}
            <h1 className="text-center text-[28px] font-medium text-[#0A58CA] m-0 mb-2">
              Registro de Usuario
            </h1>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              
              {/* Nombre completo */}
              <input
                type="text"
                name="nombreCompleto"
                placeholder="Nombre completo"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
                className="w-full h-[46px] px-3.5 rounded-md border border-[#CED4DA] bg-[#F8FAFC] text-[14px] text-gray-800 placeholder-gray-500 outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
              />

              {/* RUT */}
              <input
                type="text"
                name="rut"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={handleChange}
                required
                className="w-full h-[46px] px-3.5 rounded-md border border-[#CED4DA] bg-[#F8FAFC] text-[14px] text-gray-800 placeholder-gray-500 outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
              />

              {/* Correo electrónico */}
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full h-[46px] px-3.5 rounded-md border border-[#CED4DA] bg-[#F8FAFC] text-[14px] text-gray-800 placeholder-gray-500 outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
              />

              {/* Región */}
              <div className="relative">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className={`w-full h-[46px] px-3.5 pr-10 rounded-md border border-[#CED4DA] bg-[#FFF5F5] text-[14px] outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all appearance-none cursor-pointer ${
                    formData.region ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  <option value="" disabled hidden>Región *</option>
                  {REGIONES_CHILE.map((r) => (
                    <option key={r} value={r} className="text-gray-800">{r}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {/* Comuna */}
              <div className="relative">
                <select
                  name="comuna"
                  value={formData.comuna}
                  onChange={handleChange}
                  required
                  disabled={!formData.region || comunasDisponibles.length === 0}
                  className={`w-full h-[46px] px-3.5 pr-10 rounded-md border border-[#CED4DA] bg-[#FFF5F5] text-[14px] outline-none transition-all appearance-none ${
                    formData.region && comunasDisponibles.length > 0
                      ? "focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] cursor-pointer " + (formData.comuna ? "text-gray-800" : "text-gray-500")
                      : "cursor-not-allowed text-gray-400"
                  }`}
                >
                  <option value="" disabled hidden>Comuna *</option>
                  {comunasDisponibles.map((c) => (
                    <option key={c} value={c} className="text-gray-800">{c}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {/* Contraseña */}
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña *"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="w-full h-[46px] px-3.5 rounded-md border border-[#CED4DA] bg-[#FFFAF0] text-[14px] text-gray-800 placeholder-gray-500 outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
              />

              {/* Confirmar contraseña */}
              <input
                type="password"
                name="confirmarContrasena"
                placeholder="Confirmar contraseña"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
                className="w-full h-[46px] px-3.5 rounded-md border border-[#CED4DA] bg-[#FFFAF0] text-[14px] text-gray-800 placeholder-gray-500 outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
              />

              {/* Términos y condiciones */}
              <div className="mt-2 mb-2 pl-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    required
                    className="w-[18px] h-[18px] rounded-sm border-gray-400 text-[#0A58CA] focus:ring-[#0A58CA] cursor-pointer"
                  />
                  <span className="text-[13px] text-[#333333]">
                    Acepto los términos y condiciones *
                  </span>
                </label>
              </div>

              {/* Botón Registrarse */}
              <button
                type="submit"
                className="w-full h-[46px] rounded-md bg-[#0A58CA] text-white text-[16px] font-medium shadow-sm hover:bg-[#084298] transition-colors mt-2"
              >
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}