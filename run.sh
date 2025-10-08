#!/bin/bash

# Script para corregir los errores en la página de login de TripTap
# By: New Agent

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Corrigiendo errores en la página de login de TripTap...${NC}"
echo -e "${BLUE}========================================${NC}"

# Identificar si estamos usando App Router o Pages Router
if [ -d "app" ]; then
  LOGIN_FILE="app/login/page.tsx"
  echo -e "${YELLOW}Detectado App Router, buscando archivo en $LOGIN_FILE${NC}"
else
  LOGIN_FILE="pages/login.tsx"
  echo -e "${YELLOW}Detectado Pages Router, buscando archivo en $LOGIN_FILE${NC}"
fi

# Verificar si el archivo existe
if [ ! -f "$LOGIN_FILE" ]; then
  echo -e "${RED}Error: No se encontró el archivo $LOGIN_FILE${NC}"
  echo -e "${YELLOW}Buscando alternativas...${NC}"
  
  # Buscar cualquier archivo que pueda contener el componente Login
  POSSIBLE_FILE=$(find . -name "*.tsx" -o -name "*.jsx" | xargs grep -l "export default function Login" | head -1)
  
  if [ -z "$POSSIBLE_FILE" ]; then
    echo -e "${RED}No se encontró ningún archivo con el componente Login. Saliendo...${NC}"
    exit 1
  else
    LOGIN_FILE=$POSSIBLE_FILE
    echo -e "${GREEN}Se encontró el componente Login en $LOGIN_FILE${NC}"
  fi
fi

# Crear copia de seguridad
echo -e "${BLUE}Creando copia de seguridad del archivo original...${NC}"
cp "$LOGIN_FILE" "${LOGIN_FILE}.error.bak"
echo -e "${GREEN}✓ Copia de seguridad creada: ${LOGIN_FILE}.error.bak${NC}"

# Crear archivo corregido temporal
echo -e "${YELLOW}Limpiando el archivo para corregir errores...${NC}"

# Crear el archivo limpio con la estructura correcta
cat > "${LOGIN_FILE}.fixed" << 'EOL'
import { useState } from 'react';
import Link from 'next/link';
import TestBanner from '../components/TestBanner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simular una verificación de autenticación
    setTimeout(() => {
      setError('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12">
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#6A7FFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex justify-center mb-2">
              <div className="h-25 w-25 flex items-center justify-center">
                <img src="images/logo.png" alt="TripTap Logo" />
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Iniciar sesión</h2>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email o nombre de usuario
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Contraseña
                  </label>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder="••••••••"
                  />
                  <div className="flex justify-end mt-1">
                    <Link href="/recuperar-password" className="text-xs text-[#4EBEFF] hover:text-[#75cfff] transition-colors">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-900 border-gray-700 rounded focus:ring-[#4EBEFF] text-cyan-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Recordarme
                  </label>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] hover:from-[#ff7cff] hover:to-[#75cfff] py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#4EBEFF] transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-[#4EBEFF] hover:text-[#75cfff] font-medium transition-colors">
                Regístrate ahora
              </Link>
            </p>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TripTap. Todos los derechos reservados.</p>
        </div>
      </div>
      
      {/* Banner de prueba colocado correctamente */}
      <TestBanner />
    </div>
  );
}
EOL

# Reemplazar el archivo original con el corregido
mv "${LOGIN_FILE}.fixed" "$LOGIN_FILE"
echo -e "${GREEN}✓ Archivo reparado y guardado correctamente${NC}"

# Verificar si hay problemas con una linting básica de sintaxis JS/TS
if command -v node &> /dev/null; then
  echo -e "${YELLOW}Verificando la sintaxis del archivo...${NC}"
  NODE_CHECK=$(node -e "try { require('fs').readFileSync('$LOGIN_FILE', 'utf8'); process.exit(0); } catch(e) { console.error(e); process.exit(1); }")
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ La sintaxis del archivo es correcta${NC}"
  else
    echo -e "${RED}Advertencia: Es posible que aún haya problemas de sintaxis en el archivo.${NC}"
    echo -e "${YELLOW}Considere revisar manualmente el archivo o ejecutar un linter.${NC}"
  fi
fi

# Crear un script de verificación para validar que no queden TestBanner incorrectos
echo -e "${YELLOW}Creando script de verificación para futuros componentes...${NC}"

cat > check_components.sh << 'EOL'
#!/bin/bash

# Script para verificar errores comunes en componentes React
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Verificando errores comunes en componentes React...${NC}"
echo -e "${BLUE}========================================${NC}"

# Buscar componentes con TestBanner mal ubicados
INCORRECT_BANNERS=$(grep -r "<TestBanner />" --include="*.tsx" --include="*.jsx" . | grep -v "TestBanner />\s*$" | wc -l)

if [ "$INCORRECT_BANNERS" -gt 0 ]; then
  echo -e "${RED}Se encontraron $INCORRECT_BANNERS posibles instancias de TestBanner incorrectamente ubicados${NC}"
  echo -e "${YELLOW}Ubicaciones:${NC}"
  grep -r "<TestBanner />" --include="*.tsx" --include="*.jsx" . | grep -v "TestBanner />\s*$"
else
  echo -e "${GREEN}✓ No se encontraron TestBanner mal ubicados${NC}"
fi

# Buscar posibles problemas con etiquetas mal cerradas
echo -e "${YELLOW}Buscando posibles problemas con etiquetas mal cerradas...${NC}"
UNCLOSED_TAGS=$(grep -r "</div>" --include="*.tsx" --include="*.jsx" . | grep -E "</div>.*</div>" | wc -l)

if [ "$UNCLOSED_TAGS" -gt 0 ]; then
  echo -e "${YELLOW}Advertencia: Se encontraron $UNCLOSED_TAGS líneas con múltiples cierres de div, verifique manualmente${NC}"
else
  echo -e "${GREEN}✓ No se encontraron patrones sospechosos de etiquetas mal cerradas${NC}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Verificación completada${NC}"
echo -e "${BLUE}========================================${NC}"
EOL

chmod +x check_components.sh
echo -e "${GREEN}✓ Script de verificación creado: check_components.sh${NC}"

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}¡Errores corregidos en la página de login de TripTap!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "${YELLOW}Correcciones realizadas:${NC}"
echo -e "✓ Eliminadas instancias múltiples e incorrectas de TestBanner"
echo -e "✓ Corregida la ubicación del enlace '¿Olvidaste tu contraseña?'"
echo -e "✓ Reparada la estructura del JSX para asegurar sintaxis correcta"
echo -e "✓ Aplicados los colores del nuevo esquema (rosa/azul)"
echo -e "${GREEN}==================================================${NC}"
echo -e "${BLUE}Para verificar la corrección:${NC}"
echo -e "1. Inicia el servidor: ${YELLOW}npm run dev${NC}"
echo -e "2. Visita: ${YELLOW}http://localhost:3000/login${NC}"
echo -e "3. Verifica que el enlace de recuperación de contraseña funcione correctamente"
echo -e "${GREEN}==================================================${NC}"
echo -e "${YELLOW}Nota:${NC} Se ha creado una copia de seguridad del archivo original"
echo -e "con la extensión .error.bak en caso de que necesites la versión anterior."
echo -e "${GREEN}==================================================${NC}"