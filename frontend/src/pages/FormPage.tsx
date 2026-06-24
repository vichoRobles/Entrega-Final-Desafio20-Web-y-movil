import React, { useState, useRef } from "react";
import { IonPage, IonContent, IonRouterLink } from "@ionic/react";

const emotions = [
  { emoji: "😠", label: "Enojo" },
  { emoji: "😊", label: "Alegría" },
  { emoji: "😟", label: "Preocupación" },
];

export default function Index() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedEmotion(null);
    setDescription("");
    setPhoto(null);
  }

  return (
    <IonPage>
      <IonContent fullscreen className="font-sans" style={{ '--background': '#F0F5F9' }}>
        <div className="min-h-screen bg-[#F0F5F9] pb-12 relative">
          
          {/* Botón Volver*/}
          <div className="absolute top-6 left-6">
            <IonRouterLink
              routerLink="/detalles" 
              routerDirection="back"
              className="flex flex-col items-center gap-0.5 text-[#0A58CA] hover:text-[#084298] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
              <span className="text-[15px] font-medium">Volver</span>
            </IonRouterLink>
          </div>

          <div className="max-w-[600px] mx-auto pt-20 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-10 flex flex-col gap-8">
                
                {/* Header */}
                <div className="text-center sm:text-left">
                  <h1 className="text-[28px] font-medium text-[#0A58CA] m-0 leading-tight">
                    Comparte tu Experiencia
                  </h1>
                  <p className="mt-2 text-[14px] text-[#555555]">
                    Tu opinión es importante para mejorar nuestra ciudad
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  
                  {/* Emotion selector */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[15px] font-medium text-[#333333]">
                      ¿Cómo te sientes?
                    </span>
                    <div className="grid grid-cols-3 gap-4">
                      {emotions.map(({ emoji, label }) => (
                        <button
                          type="button"
                          key={label}
                          onClick={() =>
                            setSelectedEmotion(
                              selectedEmotion === label ? null : label
                            )
                          }
                          className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all cursor-pointer ${
                            selectedEmotion === label
                              ? "border-[#0A58CA] bg-[#F0F5F9] shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <span className="text-4xl leading-none">{emoji}</span>
                          <span className="text-[13px] font-medium text-[#333333]">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[15px] font-medium text-[#333333]">
                      Describe tu experiencia
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Cuéntanos qué pasó..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all shadow-sm"
                    />
                    <span className="text-[12px] text-gray-400">
                      {description.length} caracteres
                    </span>
                  </div>

                  {/* Photo attachment */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[15px] font-medium text-[#333333]">
                      Adjunta una fotografía (opcional)
                    </span>

                    {photo ? (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-[#0A58CA] bg-[#F0F5F9]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A58CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span className="flex-1 text-[14px] text-gray-700 truncate">
                          {photo.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPhoto(null)}
                          className="text-gray-500 hover:text-gray-800 text-xl leading-none px-2"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {/* Take photo (Simulated) */}
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) =>
                            setPhoto(e.target.files?.[0] ?? null)
                          }
                        />
                        <button 
                          type="button" 
                          onClick={() => cameraInputRef.current?.click()} 
                          className="flex items-center justify-center gap-2 h-14 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span className="text-[14px] font-medium text-[#555555]">
                            Tomar foto
                          </span>
                        </button>

                        {/* Select from gallery */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setPhoto(e.target.files?.[0] ?? null)
                          }
                        />
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()} 
                          className="flex items-center justify-center gap-2 h-14 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span className="text-[14px] font-medium text-[#555555]">
                            Seleccionar desde galería
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-2">
                    <button 
                      type="submit" 
                      className={`w-full py-3.5 rounded-xl transition-colors text-white text-[16px] font-medium shadow-sm ${
                        submitted 
                          ? "bg-[#188038] hover:bg-[#146c2f]" 
                          : "bg-[#0A58CA] hover:bg-[#084298]"
                      }`}
                    >
                      {submitted ? "¡Enviado!" : "Enviar Experiencia"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>      
      </IonContent>
    </IonPage>
  );
}