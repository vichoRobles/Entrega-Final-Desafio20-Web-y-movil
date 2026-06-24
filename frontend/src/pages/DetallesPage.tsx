import { IonPage, IonContent, IonRouterLink } from "@ionic/react";

export default function Index() {
  return (
    <IonPage>
      <IonContent fullscreen className="font-sans" style={{ '--background': '#F0F5F9' }}>
        <div className="min-h-screen bg-[#F0F5F9] pb-12">
          
          {/* Header con botón Volver */}
          <div className="absolute top-6 left-6">
            <IonRouterLink 
              routerLink="/dashboard" 
              routerDirection="back" 
              className="flex flex-col items-center gap-0.5 text-[#0A58CA] hover:text-[#084298] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
              <span className="text-[15px] font-medium">Volver</span>
            </IonRouterLink>
          </div>

          {/* Contenedor Principal de Tarjetas */}
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            
            {/* 1. Tarjeta de Cabecera e Imágenes */}
            <div className="bg-white rounded-[14px] shadow-sm p-6 sm:p-8 flex flex-col gap-5 border border-gray-100">
              <div className="flex flex-col gap-2">
                <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#0054E9] m-0 leading-tight">
                  Renovación del Parque Central
                </h1>
                <p className="text-[14px] sm:text-[15px] text-[#555555] m-0">
                  Proyecto de mejoramiento integral del Parque Central de la ciudad, incluyendo nuevas áreas verdes, zonas recreativas y espacios públicos.
                </p>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
                <div className="rounded-[12px] overflow-hidden shadow-sm h-[180px]">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/719b03d86698b5a52bd8b138b2857cd1ef7550fb?width=725"
                    alt="Imagen del proyecto 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Espacio en blanco central con sombra */}
                <div className="rounded-[12px] h-[180px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50" />
                <div className="rounded-[12px] overflow-hidden shadow-sm h-[180px]">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/6566f4af2c21fb6db707265a873f131d0a3acf0f?width=725"
                    alt="Imagen del proyecto 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tarjeta de Estado del Proyecto */}
            <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-8">
              <h2 className="text-[20px] font-semibold text-[#222222] m-0">
                Estado del Proyecto
              </h2>

              <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
                {/* Steps Row */}
                <div className="flex justify-between items-start">
                  {/* Step 1: Diseño */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 36.6667C29.2048 36.6667 36.6667 29.2048 36.6667 20C36.6667 10.7953 29.2048 3.33334 20 3.33334C10.7953 3.33334 3.33334 10.7953 3.33334 20C3.33334 29.2048 10.7953 36.6667 20 36.6667Z" stroke="#188038" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 20L18 24L26 15" stroke="#188038" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[13px] font-medium text-[#188038]">Diseño</span>
                  </div>

                  {/* Step 2: Licitación */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20C36.6666 10.7953 29.2047 3.33334 20 3.33334C10.7952 3.33334 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667Z" stroke="#0054E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 20L18 24L26 15" stroke="#0054E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[13px] font-medium text-[#0054E9]">Licitación</span>
                  </div>

                  {/* Step 3: Ejecución */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 36.6667C29.2048 36.6667 36.6667 29.2048 36.6667 20C36.6667 10.7953 29.2048 3.33334 20 3.33334C10.7953 3.33334 3.33337 10.7953 3.33337 20C3.33337 29.2048 10.7953 36.6667 20 36.6667Z" stroke="#D1D5DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[13px] font-medium text-[#99A1AF]">Ejecución</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-[#0054E9]"
                    style={{ width: "66.67%" }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center mt-2">
                <div className="bg-[#E3EDFD] rounded-xl px-6 py-2.5">
                  <span className="text-[15px] font-semibold text-[#0054E9] m-0">
                    Estado Actual: Licitación
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Tarjeta de Descripción Técnica */}
            <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-[20px] font-semibold text-[#222222] m-0">
                Descripción Técnica
              </h2>

              <p className="text-[15px] text-[#555555] leading-relaxed m-0">
                El proyecto contempla la renovación de 15,000 m² de área verde, instalación de nuevo mobiliario urbano, sistema de iluminación LED, senderos peatonales accesibles, zona de juegos infantiles inclusiva, circuito de ejercicios al aire libre y área de eventos comunitarios. Se incluye también un sistema de riego automatizado y plantación de 200 árboles nativos.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                <div className="bg-[#F8F9FA] rounded-[12px] p-5 flex flex-col gap-1.5">
                  <h3 className="text-[14px] font-medium text-[#333333] m-0">Ubicación</h3>
                  <p className="text-[14px] text-[#777777] m-0">Centro, Ciudad</p>
                </div>
                <div className="bg-[#F8F9FA] rounded-[12px] p-5 flex flex-col gap-1.5">
                  <h3 className="text-[14px] font-medium text-[#333333] m-0">Presupuesto</h3>
                  <p className="text-[14px] text-[#777777] m-0">$2,500,000</p>
                </div>
              </div>
            </div>

            {/* Botón de Acción Principal */}
            <div className="flex justify-center mt-2">
              <IonRouterLink
                routerLink="/form"
                routerDirection="forward"
                className="gap-2.5 bg-[#0054E9] text-white font-medium text-[16px] px-8 py-3.5 rounded-[12px] shadow-md hover:opacity-90 active:scale-95 transition-all inline-flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dar mi opinión
              </IonRouterLink>
            </div>
            
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}