// components/layouts/DashboardLayout.tsx
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head"; // Importar Head de Next.js
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
  FiDollarSign,
  FiRadio,
  FiMusic,
  FiRss,
  FiSmile,
  FiTag,
  FiBell,
  FiUsers,
  FiMonitor,
  FiPieChart,
  FiBarChart2,
  FiTruck,
} from "react-icons/fi";
import {
  FaAngleUp,
  FaDigitalTachograph,
  FaGripHorizontal,
} from "react-icons/fa";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  pageTitle = "Dashboard",
}: DashboardLayoutProps) {
  // Estado para el menú en responsive
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  // Nombre general del portal
  const portalName = "TripTap Media";

  // Verificar el tipo de usuario al cargar el componente
  useEffect(() => {
    const checkUserType = () => {
      // Verificar si estamos en el navegador (client-side)
      // if (typeof window !== 'undefined') {
      const userType = localStorage.getItem("userType");
      setIsAdmin(userType === "ADMIN");

      // Obtener datos del usuario
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setUserName(userData.name || "Usuario");
          setUserEmail(userData.email || "");
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      console.log(isAdmin);
    };

    checkUserType();
  }, []);

  // Redirigir al usuario si accede a una ruta restringida
  useEffect(() => {
    const restrictedPaths = [
      "/app/dashboard", // Solo para administradores
      "/app/users",
      "/app/funs",
      "/app/music",
      "/app/news",
      "/app/podcasts",
      "/app/pricing-config",
      "/app/offerts", // Solo para administradores
    ];

    const currentPath = router.pathname;

    // if (!isAdmin && restrictedPaths.some(path => currentPath.startsWith(path))) {
    //   // Redirigir al anunciante a sus anuncios
    //   router.push('/app/ads');
    // }
  }, [isAdmin, router]);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Función para verificar si una ruta está activa
  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  // Cerrar el menú de usuario cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Determinar la página principal (landing page) según el tipo de usuario
  useEffect(() => {
    if (router.pathname === "/app" || router.pathname === "/app/") {
      if (isAdmin) {
        router.push("/app/dashboard");
      } else {
        router.push("/app/ads");
      }
    }
  }, [isAdmin, router]);

  return (
    <>
      {/* Componente Head para el título de la página */}
      <Head>
        <title>{pageTitle ? `${pageTitle} | ${portalName}` : portalName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#6A7FFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Overlay para cerrar menú en móvil */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar/Menu lateral */}
        <div
          className={`${
            isMobile ? "fixed" : "fixed"
          } z-30 h-full transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } w-64 bg-gray-800/60 backdrop-blur-xl border-r border-gray-700 shadow-lg flex flex-col`}
        >
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center h-20 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="TripTap Logo" className="w-20" />
            </div>
          </div>

          {/* Menú de navegación con scroll */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="px-4 py-6">
              <ul className="space-y-1">
                {/* ADMIN ONLY: Dashboard */}
                {isAdmin && (
                  <li>
                    <Link
                      href="/app/dashboard"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                        isActive("/app/dashboard") ? "white" : "gray-300"
                      } ${
                        isActive("/app/dashboard")
                          ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                          : "hover:text-white hover:bg-gray-700/50"
                      } transition-colors`}
                    >
                      <FiHome
                        className={
                          isActive("/app/dashboard")
                            ? "text-[#4EBEFF]"
                            : "text-gray-400"
                        }
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                )}

                {/* ADMIN ONLY: Sección de Administración */}
                {isAdmin && (
                  <>
                    <li className="pt-2">
                      <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Administración
                      </div>
                    </li>

                    <li>
                      <Link
                        href="/app/users"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/users") ? "white" : "gray-300"
                        } ${
                          isActive("/app/users")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiUsers
                          className={
                            isActive("/app/users")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Usuarios</span>
                      </Link>
                    </li>
                  </>
                )}

                {/* ADMIN ONLY: Sección de Contenido */}
                {isAdmin && (
                  <>
                    <li className="pt-2">
                      <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Contenido
                      </div>
                    </li>

                    <li>
                      <Link
                        href="/app/funs"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/funs") ? "white" : "gray-300"
                        } ${
                          isActive("/app/funs")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiSmile
                          className={
                            isActive("/app/funs")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Entretenimiento</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/app/music"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/music") ? "white" : "gray-300"
                        } ${
                          isActive("/app/music")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiMusic
                          className={
                            isActive("/app/music")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Música</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/app/news"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/news") ? "white" : "gray-300"
                        } ${
                          isActive("/app/news")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiRss
                          className={
                            isActive("/app/news")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Noticias</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/app/podcasts"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/podcasts") ? "white" : "gray-300"
                        } ${
                          isActive("/app/podcasts")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiRadio
                          className={
                            isActive("/app/podcasts")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Podcasts</span>
                      </Link>
                    </li>
                  </>
                )}

                {/* Sección Comercial con elementos según tipo de usuario */}
                <li className="pt-2">
                  <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Comercial
                  </div>
                </li>

                <li>
                  <Link
                    href="/app/ads"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                      isActive("/app/ads") ? "white" : "gray-300"
                    } ${
                      isActive("/app/ads")
                        ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                        : "hover:text-white hover:bg-gray-700/50"
                    } transition-colors`}
                  >
                    <FiMonitor
                      className={
                        isActive("/app/ads")
                          ? "text-[#4EBEFF]"
                          : "text-gray-400"
                      }
                    />
                    <span>Mis Anuncios</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/app/metrics"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                      isActive("/app/metrics") ? "white" : "gray-300"
                    } ${
                      isActive("/app/metrics")
                        ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                        : "hover:text-white hover:bg-gray-700/50"
                    } transition-colors`}
                  >
                    <FiBarChart2
                      className={
                        isActive("/app/metrics")
                          ? "text-[#4EBEFF]"
                          : "text-gray-400"
                      }
                    />
                    <span>Métricas de Anuncios</span>
                  </Link>
                </li>

                {/* ADMIN ONLY: Ofertas */}
                {isAdmin && (
                  <li>
                    <Link
                      href="/app/offerts"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                        isActive("/app/offerts") ? "white" : "gray-300"
                      } ${
                        isActive("/app/offerts")
                          ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                          : "hover:text-white hover:bg-gray-700/50"
                      } transition-colors`}
                    >
                      <FiTag
                        className={
                          isActive("/app/offerts")
                            ? "text-[#4EBEFF]"
                            : "text-gray-400"
                        }
                      />
                      <span>Ofertas</span>
                    </Link>
                  </li>
                )}

{isAdmin && (
                  <>
                    <li className="pt-2">
                      <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Conductores
                      </div>
                    </li>

                    <li>
                      <Link
                        href="/app/drivers"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/drivers") ? "white" : "gray-300"
                        } ${
                          isActive("/app/drivers")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiTruck
                          className={
                            isActive("/app/drivers")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Resumen de Conductores</span>
                      </Link>
                    </li>
                  </>
                )}

{isAdmin && (
                  <>
                    <li className="pt-2">
                      <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Pagos
                      </div>
                    </li>

                    <li>
                      <Link
                        href="/app/earnings"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/earnings") ? "white" : "gray-300"
                        } ${
                          isActive("/app/earnings")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiDollarSign
                          className={
                            isActive("/app/earnings")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Administración de Pagos</span>
                      </Link>
                    </li>
                  </>
                )}

                {/* ADMIN ONLY: Sección de Configuración */}
                {isAdmin && (
                  <>
                    <li className="pt-2">
                      <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Configuración
                      </div>
                    </li>

                    <li>
                      <Link
                        href="/app/pricing-config"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/pricing-config") ? "white" : "gray-300"
                        } ${
                          isActive("/app/pricing-config")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiDollarSign
                          className={
                            isActive("/app/pricing-config")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Configuración de Precios</span>
                      </Link>
                    </li>


                    <li>
                      <Link
                        href="/app/kiosk"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-${
                          isActive("/app/kiosk") ? "white" : "gray-300"
                        } ${
                          isActive("/app/kiosk")
                            ? "bg-gradient-to-r from-[#EF5AFF]/20 to-[#4EBEFF]/20 border border-gray-700"
                            : "hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        <FiMenu
                          className={
                            isActive("/app/kiosk")
                              ? "text-[#4EBEFF]"
                              : "text-gray-400"
                          }
                        />
                        <span>Kioskos</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>

          {/* Footer del sidebar */}
          <div className="flex-shrink-0 border-t border-gray-700 px-4 py-4">
            <div className="text-xs text-gray-500 text-center">
              <p>© {new Date().getFullYear()} TripTap</p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div
          className={`min-h-screen transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          {/* Header */}
          <header className="bg-gray-800/60 backdrop-blur-xl border-b border-gray-700">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white lg:hidden"
                >
                  {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-white">
                    {pageTitle}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notificaciones */}
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 relative">
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF5AFF] rounded-full"></span>
                </button>

                {/* Menú de usuario */}
                <div className="relative user-menu-container">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-700/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white hidden md:block">
                      {userName || "Usuario"}
                    </span>
                  </button>

                  {/* Dropdown del usuario simplificado */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg py-1 z-[100]">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-white font-medium">
                          {userName || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-400">{userEmail}</p>
                        <div className="mt-1 py-1 px-2 rounded-md bg-gray-700/50 text-xs text-white">
                          {isAdmin ? "Administrador" : "Anunciante"}
                        </div>
                      </div>
                      <ul>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300"
                          >
                            <FiLogOut className="mr-2" size={16} />
                            Cerrar Sesión
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
