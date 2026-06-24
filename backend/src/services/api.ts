const BASE_URL = 'http://localhost:3000/api';

interface OpcionesPeticion extends RequestInit {
  body?: any;
}

const api = async (endpoint: string, opciones: OpcionesPeticion = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const token = localStorage.getItem('token_jwt');
  
  const headers = new Headers(opciones.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const configuracion: RequestInit = {
    ...opciones,
    headers,
  };

  if (opciones.body) {
    configuracion.body = JSON.stringify(opciones.body);
  }

  try {
    const respuesta = await fetch(url, configuracion);

    if (!respuesta.ok) {
      const status = respuesta.status;
      
      let datosError: any = {};
      try {
        datosError = await respuesta.json();
      } catch {
      }

      switch (status) {
        case 401:
          console.error("🔴 Sesión inválida o expirada a nivel global. Limpiando credenciales...");
          localStorage.removeItem('token_jwt');
          localStorage.removeItem('usuario_rol');
          localStorage.removeItem('usuario_nombre');
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          alert(datosError.mensaje || "Acceso prohibido. No tienes los permisos requeridos.");
          break;

        case 400:
          console.error("⚠️ Solicitud incorrecta (Bad Request):", datosError.mensaje);
          break;

        case 404:
          console.warn("🔍 Recurso no encontrado (Not Found):", datosError.mensaje);
          break;

        case 409:
          alert(datosError.mensaje || "Conflicto en la integridad de los datos.");
          break;

        case 500:
          console.error("🔥 Error crítico en el servidor PostgreSQL del backend.");
          break;
      }

      
      const errorApi = new Error(datosError.mensaje || "Error en la petición");
      (errorApi as any).response = { status, data: datosError };
      throw errorApi;
    }

    
    return await respuesta.json();

  } catch (error: any) {
    if (error.message && error.message.includes('Failed to fetch')) {
      console.error("🌐 No se pudo establecer comunicación con el servidor backend.");
    }
    throw error;
  }
};

export default api;