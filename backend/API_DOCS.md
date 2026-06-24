# **📖 Documentación de API \- Sistema de Participación Ciudadana**

Documentación oficial de la API REST para el sistema municipal. Permite gestionar a sus usuarios, proyectos y las opiniones ciudadanas. 
**Base URL Local:** http://localhost:3000/api

## **🔐 Autenticación y Autorización**

La API utiliza **JSON Web Tokens (JWT)** para la seguridad. Las rutas protegidas requieren que se envíe el token en los encabezados (headers) de la solicitud HTTP.

* **Header Key:** Authorization  
* **Header Value:** Bearer \<tu\_token\_jwt\>

### **Jerarquía de Roles**

* Public: Accesible para cualquier usuario de internet (no requiere token).  
* User: Accesible para cualquier ciudadano registrado (requiere token válido).  
* Admin: Accesible únicamente para administradores municipales (requiere token de administrador).

## **🛠️ Endpoints de Salud y Pruebas**

### **1\. Verificar Estado del Servidor**

Verifica si el servidor Node.js y la conexión a la base de datos están activos.

* **URL:** /health  
* **Método:** GET  
* **Acceso:** Public  
* **Respuesta Exitosa (200 OK):**  
  ```json  
  {  
    "status": "success",  
    "message": "API corriendo correctamente!"  
  }

## **👤 Endpoints de Autenticación (/auth)**

### **1\. Registrar Nuevo Usuario**

Crea un nuevo usuario en el sistema. Por defecto, todos los usuarios registrados a través de esta ruta reciben el rol user. Las contraseñas son encriptadas automáticamente usando bcrypt.

* **URL:** /auth/register  
* **Método:** POST  
* **Acceso:** Public  
* **Body Request (JSON):**  
  ```json  
  {  
    "rut": "12345678-9",  
    "nombre\_completo": "Juan Pérez",  
    "correo": "juan.perez@email.com",  
    "region": "Valparaíso",  
    "comuna": "Quilpué",  
    "contrasena": "segura123"  
  }
  ```

* **Respuesta Exitosa (201 Created):**  
  ```json  
  {  
    "success": true,  
    "message": "User registered successfully",  
    "data": {  
      "id": 2,  
      "rut": "12345678-9",  
      "nombre\_completo": "Juan Pérez",  
      "correo": "juan.perez@email.com",  
      "rol": "user"  
    },  
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."  
  }
  ```

* **Respuestas de Error:** 400 Bad Request (Faltan campos o correo/RUT duplicado).

### **2\. Iniciar Sesión**

Autentica a un usuario y devuelve un JWT válido por 30 días.

* **URL:** /auth/login  
* **Método:** POST  
* **Acceso:** Public  
* **Body Request (JSON):**  
  ```json  
  {  
    "correo": "juan.perez@email.com",  
    "contrasena": "segura123"  
  }
  ```

* **Respuesta Exitosa (200 OK):** Devuelve el objeto del usuario y el token.  
* **Respuestas de Error:** 401 Unauthorized (Credenciales inválidas).

## **👥 Endpoints de Usuarios (/usuarios)**

### **1\. Obtener Perfil Actual**

Devuelve la información del usuario actualmente autenticado basado en el JWT proporcionado en los headers. No se envía el ID en la URL por razones de seguridad.

* **URL:** /usuarios/me  
* **Método:** GET  
* **Acceso:** User / Admin (Protegido)  
* **Respuesta Exitosa (200 OK):**  
  ```json  
  {  
    "success": true,  
    "data": {  
      "id": 2,  
      "rut": "12345678-9",  
      "nombre\_completo": "Juan Pérez",  
      "correo": "juan.perez@email.com",  
      "region": "Valparaíso",  
      "comuna": "Quilpué",  
      "rol": "user",  
      "creado\_en": "2026-06-03T10:00:00.000Z"  
    }  
  }
  ```

### **2\. Listar Todos los Usuarios**

Devuelve una lista completa de todos los ciudadanos y administradores registrados en la plataforma.

* **URL:** /usuarios  
* **Método:** GET  
* **Acceso:** Admin Only  
* **Respuesta Exitosa (200 OK):** Devuelve un arreglo de usuarios.  
* **Respuestas de Error:** 403 Forbidden (Si un usuario estándar intenta acceder).

## **🏗️ Endpoints de Proyectos (/proyectos)**

### **1\. Listar Proyectos**

Obtiene todo el catálogo de proyectos municipales ordenados por su registro más reciente.

* **URL:** /proyectos  
* **Método:** GET  
* **Acceso:** Public  
* **Respuesta Exitosa (200 OK):**  
  ```json  
  {  
    "success": true,  
    "data": \[  
      {  
        "id": 1,  
        "nombre": "Mejora Plaza Central",  
        "tipo": "público",  
        "descripcion": "Instalación de nuevas luminarias.",  
        "estado": "Planificado",  
        "lat": "-33.045000",  
        "lng": "-71.442000",  
        "presupuesto": 50000000,  
        "ubicacion\_texto": "Plaza de Quilpué"  
      }  
    \]  
  }
  ```

### **2\. Obtener Proyecto por ID**

* **URL:** /proyectos/:id  
* **Método:** GET  
* **Acceso:** Public

### **3\. Crear Proyecto Nuevo**

Ingresa un nuevo proyecto a la base de datos de la municipalidad.

* **URL:** /proyectos  
* **Método:** POST  
* **Acceso:** Admin Only  
* **Body Request (JSON):**  
  ```json  
  {  
    "nombre": "Pavimentación Los Pinos",  
    "tipo": "infraestructura",  
    "descripcion": "Reparación de calzada en sector norte.",  
    "lat": \-33.033,  
    "lng": \-71.433,  
    "fecha\_inicio": "2026-08-01",  
    "fecha\_fin": "2026-11-30",  
    "presupuesto": 120000000,  
    "ubicacion\_texto": "Sector Los Pinos, Quilpué"  
  }
  ```

* **Nota de Datos:** tipo debe ser de acuerdo al ENUM (residencial, comercial, infraestructura, público).

### **4\. Actualizar Proyecto**

Modifica atributos específicos de un proyecto existente (ej. avanzar su estado).

* **URL:** /proyectos/:id  
* **Método:** PUT  
* **Acceso:** Admin Only  
* **Body Request (JSON):** (Solo incluir los campos a actualizar)  
  ```json  
  {  
    "estado": "En Progreso"  
  }
  ```

### **5\. Eliminar Proyecto**

* **URL:** /proyectos/:id  
* **Método:** DELETE  
* **Acceso:** Admin Only

## **🗣️ Endpoints de Opiniones (/opiniones)**

### **1\. Listar Opiniones**

Visualiza todas las retroalimentaciones ciudadanas, ideal para el dashboard administrativo o feeds públicos.

* **URL:** /opiniones  
* **Método:** GET  
* **Acceso:** Public

### **2\. Obtener Opinión por ID**

* **URL:** /opiniones/:id  
* **Método:** GET  
* **Acceso:** Public

### **3\. Publicar una Opinión**

Permite a un ciudadano registrado dar su opinión sobre un proyecto específico. El sistema asocia automáticamente la opinión al usuario logueado mediante su JWT, garantizando la integridad de los datos.

* **URL:** /opiniones  
* **Método:** POST  
* **Acceso:** User / Admin (Protegido)  
* **Body Request (JSON):**  
  ```json  
  {  
    "proyecto\_id": 1,  
    "emocion": "Alegría",  
    "descripcion": "Me parece excelente, hacía falta seguridad en la plaza.",  
    "categoria": "Seguridad"  
  }
  ```

* **Nota de Datos:** emocion debe corresponder al ENUM (Enojo, Alegría, Preocupación).

### **4\. Actualizar Estado de Opinión (Gestión Municipal)**

Permite a los administradores moderar o marcar el seguimiento de una opinión ciudadana.

* **URL:** /opiniones/:id  
* **Método:** PUT  
* **Acceso:** Admin Only  
* **Body Request (JSON):**  
  ```json  
  {  
    "estado": "Considerada"  
  }
  ```

* **Nota de Datos:** estado debe corresponder al ENUM (Recibida, En análisis por IA, Considerada, No recibida).

### **5\. Eliminar Opinión**

Elimina permanentemente un registro de opinión del sistema por violaciones de normas o moderación extrema.

* **URL:** /opiniones/:id  
* **Método:** DELETE  
* **Acceso:** Admin Only