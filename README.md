# Zerus — Portal Privado de Salud Mental UDP

Portal web privado de la Dirección de Salud Mental de la **Universidad Diego Portales**. Permite a estudiantes agendar horas de atención psicológica y a profesionales de la salud gestionar fichas clínicas y disponibilidad.

> Este es uno de los dos portales del proyecto Zerus. Ver también: [Portal Público](https://github.com/Niennis/psm-public)

## 🚀 Demo

[Ver sitio en producción](https://psm-private.vercel.app/)

> ⚠️ El acceso requiere credenciales. Este es un sistema de uso interno de la UDP.

## ✨ Funcionalidades

- **Estudiantes:** agendar horas de atención psicológica, ver historial de citas
- **Profesionales:** gestionar disponibilidad, fichas clínicas de pacientes
- **Administradores:** gestión de profesionales y configuración del sistema
- Autenticación segura con perfiles diferenciados por rol
- Cumplimiento de normativas de privacidad de datos clínicos

## 🛠️ Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | JavaScript |
| Autenticación | NextAuth.js v4 |
| UI / Estilos | Material UI v5, Ant Design 5, Bootstrap 5 |
| Calendario | FullCalendar 6 |
| Editor de texto | CKEditor 5 |
| Formularios | React Hook Form |
| HTTP client | Axios |
| Fechas | Day.js |
| Mocking (dev) | MSW v2 |
| Despliegue | Vercel / Azure App Services |

## ⚙️ Cómo correr localmente

```bash
# Clonar el repositorio
git clone https://github.com/Niennis/psm-private.git
cd psm-private

# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

> **Nota:** Este proyecto requiere variables de entorno para conectarse a la base de datos y configurar NextAuth.js. Contactar al equipo para obtener acceso.

## 📁 Estructura del proyecto

```
src/
├── app/                    # Páginas y rutas (App Router)
│   ├── api/                # Route handlers (auth, file-proxy, captcha)
│   ├── blog/               # Gestión de blog
│   ├── citas/              # Agendamiento y detalle de citas
│   ├── fichas/             # Fichas clínicas
│   ├── grupos/             # Gestión de grupos
│   ├── horarios/           # Horarios de profesionales
│   ├── pacientes/          # Vista de pacientes
│   ├── profesionales/      # Gestión de profesionales
│   └── reportes/           # Reportes
├── assets/                 # CSS global, fuentes e imágenes
├── components/             # Componentes reutilizables
│   └── skeletons/          # Skeletons de carga
├── context/                # React Context (estado global)
├── mocks/                  # Handlers MSW para desarrollo
├── providers/              # Providers de React
├── services/               # Llamadas a la API externa
└── utils/                  # Funciones utilitarias
public/                     # Recursos estáticos
```

## 🔗 Proyecto relacionado

El [portal público](https://github.com/Niennis/psm-public) entrega información y recursos educativos a la comunidad, y es el punto de entrada al sistema.

## 👩‍💻 Desarrollada por

[Estefanía Osses Vera](https://github.com/Niennis) — Freelance, 2023–2025
