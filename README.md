# TripTap - Página de Login

Esta es una página de login moderna y elegante para TripTap, una aplicación de viajes.

## Características

- **Diseño oscuro moderno**: Interfaz elegante con estética oscura
- **Responsive**: Se adapta perfectamente a todas las pantallas (móvil, tablet, desktop)
- **Interactiva**: Efectos visuales y transiciones suaves
- **Seguridad simulada**: Cualquier combinación de credenciales mostrará un error

## Tecnologías utilizadas

- Next.js
- TypeScript
- Tailwind CSS

## Estructura del proyecto

## Páginas Disponibles

### Página de Login
- Ruta: `/login`
- Funcionalidad: Permite a los usuarios iniciar sesión con email y contraseña
- Muestra un mensaje de error independientemente de las credenciales ingresadas

### Página de Registro
- Ruta: `/register`
- Funcionalidad: Permite a nuevos usuarios registrarse como Empresa o Agencia
- Campos: Tipo de registro, Nombre de Empresa/Agencia, Email, Teléfono, Contraseña
- Validación: Confirma que las contraseñas coincidan y tengan al menos 8 caracteres
- Error simulado: Muestra un error de conexión al API al intentar registrarse

### Página de Recuperación de Contraseña
- Ruta: `/recuperar-password`
- Funcionalidad: Permite a los usuarios solicitar un enlace para restablecer su contraseña
- Validación: Comprueba que se ingrese un formato de email válido
- Error simulado: Muestra un error de conexión al servidor al intentar enviar la solicitud
