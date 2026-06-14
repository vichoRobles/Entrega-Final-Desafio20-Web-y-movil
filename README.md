# Entrega-Final-Desafio20-Web-y-movil

## EF 1: Implementación de funcionalidades completas (CRUD, notificaciones, almacenamiento local) de acuerdo a los requerimientos funcionales y no funcionales definidos.

## EF 2: Mejoras en UI/UX y optimización de rendimiento

Se hicieron mejoras en la interfaz de las vistas de la aplicación, se unieron todas las páginas individuales de diseño en una sola página web funcional, además se realizaron optimizaciones relacionadas a UI/UX principalmente enfocadas en reducir los tiempos de carga inicial de las páginas.

## EF 3: Implementación de seguridad avanzada en API: protección contra inyección SQL/XSS, implementación CORS seguro, y encriptación de datos sensibles con bcrypt

Las seguridades avanzadas en API ayudan a mantener la seguridad en nuestra página web de la siguiente forma :

**Protección contra inyección SQL/XSS :** Se implementaron las protecciones contra la inyección SQL la cual consiste en uno de los principales y más sencillos ataques de páginas web en internet, colocando consultas SQL o XSS en la página para alterar el funcionamiento de nuestra base de datos (SQL) o nuestro código de JavaScript (XSS) , esta debilidad potencial la protegimos utilizando consultas parametrizadas que no puedan ser modificadas por consultas externas, y además, gracias al proceso de validación de los datos recibidos  por el usuario (el usuario está limitado a responder únicamente lo que se le solicita en las interfaces de usuario utilizando la validación de campos).

**La implementación de CORS seguro :** En nuestra página web, adoptamos el uso de CORS, el cual es un mecanismo de protección que evita a aplicaciones externas no autorizadas interactuar con nuestra API, evitando el posible abuso de realizar solicitudes API con orígenes diferentes, al restringir el origen a únicamente dominios conocidos y confiables. 

**Encriptación de los datos sensibles utilizando bcrypt :** Esta encriptación asegura que las contraseñas y otros datos sensibles dentro de la aplicación no sean almacenados en texto plano porque es inseguro y puede ser modificable, para solucionar este problema implementamos bcrypt el cual implementa el hashing digital para proteger contraseñas convirtiendolas en una cadena matemática segura,  y de esta manera protegerlas de ser filtradas

## EF 4: Optimización de consultas y respuesta eficiente.

## EF 5: Integración con algún servicio externo (AWS o APIs de terceros).

## EF 6: Despliegue con docker
