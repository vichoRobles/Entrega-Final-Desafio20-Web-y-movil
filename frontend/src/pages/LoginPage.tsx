import { IonContent, IonPage, IonRouterLink } from '@ionic/react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../utils/AuthContext';

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);

  // Rol por defecto asignado a 'user'
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const navigate = useNavigate();
  const { login } = useAuth();

  // ---> LÓGICA DEL BACKEND PRUEBA (Mantenida pero oculta visualmente) <---
  const [mensajeBackend, setMensajeBackend] = useState<string>("Cargando conexión...");

  useEffect(() => {
    fetch('http://localhost:3000/api/estado')
      .then(respuesta => respuesta.json())
      .then(datos => setMensajeBackend(datos.mensaje))
      .catch(error => setMensajeBackend("Backend desconectado 🔴"));
  }, []);
  // --------------------------------------

  const handleLogin = (role: UserRole = 'user') => {
    // Si se hace clic en el botón normal, el rol es 'user'. 
    // Si se hace clic en el botón de admin, el rol será 'admin'.
    login(role);
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#F0F5F9] font-sans">
          
          <div className="w-full max-w-[400px] flex flex-col gap-6">
            
            {/* Card Principal */}
            <div className="w-full rounded-2xl bg-white shadow-sm border border-gray-100 p-8 pb-10">
              
              {/* Header */}
              <div className="flex flex-col items-center gap-2 mb-8">
                <h1 className="text-[28px] font-medium leading-9 text-center text-[#0A58CA] m-0">
                  Bienvenido
                </h1>
                <p className="text-sm font-normal text-[#6C757D] text-center leading-6 m-0">
                  Inicia sesión en tu cuenta
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-5">
                
                {/* Email / RUT field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#495057] leading-6">
                    Correo electrónico o RUT
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6667 3.33334H3.33335C2.41288 3.33334 1.66669 4.07954 1.66669 5.00001V15C1.66669 15.9205 2.41288 16.6667 3.33335 16.6667H16.6667C17.5872 16.6667 18.3334 15.9205 18.3334 15V5.00001C18.3334 4.07954 17.5872 3.33334 16.6667 3.33334Z" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.3334 5.83334L10.8584 10.5833C10.6011 10.7445 10.3036 10.83 10 10.83C9.69642 10.83 9.39896 10.7445 9.14169 10.5833L1.66669 5.83334" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="correo@ejemplo.com o 12.345.678-9"
                      className="w-full h-[46px] pl-10 pr-4 rounded-md border border-[#CED4DA] bg-[#F8FAFC] text-sm font-normal text-[#212529] placeholder-[#ADB5BD] outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#495057] leading-6">
                    Contraseña
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8333 9.16666H4.16667C3.24619 9.16666 2.5 9.91285 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91285 16.7538 9.16666 15.8333 9.16666Z" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.83331 9.16666V5.83332C5.83331 4.72825 6.2723 3.66845 7.0537 2.88704C7.8351 2.10564 8.89491 1.66666 9.99998 1.66666C11.105 1.66666 12.1649 2.10564 12.9463 2.88704C13.7277 3.66845 14.1666 4.72825 14.1666 5.83332V9.16666" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full h-[46px] pl-10 pr-12 rounded-md border border-[#CED4DA] bg-[#FFFAF0] text-sm font-normal text-[#212529] placeholder-[#ADB5BD] outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#0A58CA] transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.71835 10.29C1.6489 10.1029 1.6489 9.89709 1.71835 9.71C2.39476 8.06987 3.54294 6.66753 5.01732 5.68074C6.4917 4.69396 8.22588 4.16718 10 4.16718C11.7741 4.16718 13.5083 4.69396 14.9827 5.68074C16.4571 6.66753 17.6053 8.06987 18.2817 9.71C18.3511 9.89709 18.3511 10.1029 18.2817 10.29C17.6053 11.9301 16.4571 13.3325 14.9827 14.3192C13.5083 15.306 11.7741 15.8328 10 15.8328C8.22588 15.8328 6.4917 15.306 5.01732 14.3192C3.54294 13.3325 2.39476 11.9301 1.71835 10.29Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <a href="#" className="text-[13px] font-medium text-[#0A58CA] leading-5 hover:underline">
                    ¿Olvidé mi contraseña?
                  </a>
                </div>

                {/* Submit button (Usuario Normal) */}
                <button
                  type="button"
                  onClick={() => handleLogin('user')}
                  className="w-full h-[46px] rounded-md text-[15px] font-medium text-white leading-6 bg-[#0A58CA] hover:bg-[#084298] transition-colors"
                >
                  Iniciar sesión
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-1 border-t border-[#E5E7EB]" />
                <span className="mx-4 bg-white text-xs text-[#6C757D] uppercase">o</span>
                <div className="flex-1 border-t border-[#E5E7EB]" />
              </div>

              {/* Register section */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-[13px] font-normal text-[#6C757D] leading-6 text-center m-0">
                  ¿No tienes una cuenta?
                </p>
                <IonRouterLink
                  routerLink="/register"
                  routerDirection="forward"
                  className="w-[145px] h-[46px] rounded-md border border-[#0A58CA] text-[14px] font-medium text-[#0A58CA] leading-6 hover:bg-[#F0F5F9] transition-colors inline-flex items-center justify-center"
                >
                  Registrarse
                </IonRouterLink>
              </div>
            </div>

            {/* --- NUEVO: Botón Ingresar como Admin (Fuera de la tarjeta principal) --- */}
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={() => handleLogin('admin')}
                className="flex items-center gap-2 text-[14px] font-medium text-[#6C757D] hover:text-[#0A58CA] transition-colors px-4 py-2 rounded-lg hover:bg-white/50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Ingresar como Administrador
              </button>
            </div>
            {/* ---------------------------------------------------------------------- */}

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}