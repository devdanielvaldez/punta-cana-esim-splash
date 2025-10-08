// components/music/MusicForm.tsx
import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiMusic, FiUser, FiImage, FiCheck, FiAlertCircle, FiX, FiPlay, FiPause } from 'react-icons/fi';

interface MusicFormProps {
  initialData?: {
    artistName: string;
    songName: string;
    flyer: string;
    songUrl: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

// Servicio para subir archivos
const uploadFileService = {
  uploadFile: async (file: File) => {
    console.log("Iniciando carga de archivo:", file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://api.triptapmedia.com/api/upload_file/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Respuesta del servidor:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error de servidor:", errorData);
        throw new Error(errorData.message || `Error al subir el archivo: ${response.status}`);
      }

      const result = await response.json();
      console.log("Resultado exitoso:", result);
      return result;
    } catch (error) {
      console.error("Error en la carga:", error);
      throw error;
    }
  }
};

export default function MusicForm({ initialData, onSubmit, isSubmitting }: MusicFormProps) {
  const [formData, setFormData] = useState({
    artistName: '',
    songName: '',
    flyer: '',
    songUrl: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  // Estados para manejo de errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados para el archivo de imagen
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Estados para el archivo de audio
  const [previewAudioFile, setPreviewAudioFile] = useState<File | null>(null);
  const [previewAudioName, setPreviewAudioName] = useState<string>('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Si hay una imagen inicial, establecerla como vista previa
      if (initialData.flyer) {
        setPreviewImageUrl(initialData.flyer);
      }
    }
    
    // Limpiar reproductor de audio al desmontar
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value
    }));
    
    // Limpiar errores al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejadores para la carga de imágenes
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, flyer: 'El archivo debe ser una imagen' }));
      return;
    }

    // Establecer el archivo y crear una vista previa local
    setPreviewImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
    
    // Limpiar error si existe
    if (errors.flyer) {
      setErrors(prev => ({ ...prev, flyer: '' }));
    }

    // Subir la imagen automáticamente cuando se selecciona
    await uploadImage(file);
  };

  // Manejadores para la carga de audio
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('audio/')) {
      setErrors(prev => ({ ...prev, songUrl: 'El archivo debe ser un audio' }));
      return;
    }

    // Establecer el archivo y guardar su nombre
    setPreviewAudioFile(file);
    setPreviewAudioName(file.name);
    
    // Si hay un audio reproduciéndose, detenerlo
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
    
    // Limpiar error si existe
    if (errors.songUrl) {
      setErrors(prev => ({ ...prev, songUrl: '' }));
    }

    // Subir el audio automáticamente cuando se selecciona
    await uploadAudio(file);
  };

  // Funciones para subir archivos
  const uploadImage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploadingImage(true);
      // Subir archivo y obtener respuesta
      const result = await uploadFileService.uploadFile(file);
      
      // Si la carga fue exitosa y tenemos una URL
      if (result && result.url) {
        console.log('URL de imagen obtenida:', result.url);
        // Actualizar el estado del formulario con la URL
        setFormData(prev => ({ ...prev, flyer: result.url }));
        // Mantener la vista previa pero eliminar el archivo pendiente
        setPreviewImageFile(null);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setErrors(prev => ({ ...prev, flyer: 'Error al subir la imagen' }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadAudio = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploadingAudio(true);
      // Subir archivo y obtener respuesta
      const result = await uploadFileService.uploadFile(file);
      
      // Si la carga fue exitosa y tenemos una URL
      if (result && result.url) {
        console.log('URL de audio obtenida:', result.url);
        // Actualizar el estado del formulario con la URL
        setFormData(prev => ({ ...prev, songUrl: result.url }));
        // Eliminar el archivo pendiente pero mantener el nombre para la interfaz
        setPreviewAudioFile(null);
      }
    } catch (error) {
      console.error('Error al subir el audio:', error);
      setErrors(prev => ({ ...prev, songUrl: 'Error al subir el archivo de audio' }));
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Función para limpiar la imagen
  const clearImage = () => {
    setPreviewImageFile(null);
    setPreviewImageUrl('');
    setFormData(prev => ({ ...prev, flyer: '' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Función para limpiar el audio
  const clearAudio = () => {
    setPreviewAudioFile(null);
    setPreviewAudioName('');
    setFormData(prev => ({ ...prev, songUrl: '' }));
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
    // Si hay un audio reproduciéndose, detenerlo
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Función para controlar la reproducción de audio
  const toggleAudioPlay = () => {
    if (!formData.songUrl) return;
    
    if (!audio) {
      const newAudio = new Audio(formData.songUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
      newAudio.play().then(() => setIsPlaying(true)).catch(err => {
        console.error('Error al reproducir audio:', err);
        setErrors(prev => ({ ...prev, songUrl: 'Error al reproducir el audio' }));
      });
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        if (audio.src !== formData.songUrl) {
          audio.src = formData.songUrl;
        }
        audio.play().catch(err => {
          console.error('Error al reproducir audio:', err);
          setErrors(prev => ({ ...prev, songUrl: 'Error al reproducir el audio' }));
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.artistName.trim()) newErrors.artistName = 'El nombre del artista es requerido';
    if (!formData.songName.trim()) newErrors.songName = 'El nombre de la canción es requerido';
    if (!formData.flyer && !previewImageFile) newErrors.flyer = 'La imagen del flyer es requerida';
    if (!formData.songUrl && !previewAudioFile) newErrors.songUrl = 'El archivo de audio es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si hay archivos pendientes de subir, subirlos primero
    const uploadPromises = [];
    if (previewImageFile) {
      uploadPromises.push(uploadImage(previewImageFile));
    }
    if (previewAudioFile) {
      uploadPromises.push(uploadAudio(previewAudioFile));
    }
    
    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }
    
    // Validar y enviar el formulario
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo de Artista */}
        <div>
          <label htmlFor="artistName" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Artista
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-500" />
            </div>
            <input
              type="text"
              id="artistName"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              className={`pl-10 block w-full bg-gray-900/60 border ${errors.artistName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] placeholder-gray-500`}
              placeholder="Nombre del artista"
            />
          </div>
          {errors.artistName && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.artistName}
            </p>
          )}
        </div>

        {/* Campo de Canción */}
        <div>
          <label htmlFor="songName" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre de la Canción
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMusic className="text-gray-500" />
            </div>
            <input
              type="text"
              id="songName"
              name="songName"
              value={formData.songName}
              onChange={handleChange}
              className={`pl-10 block w-full bg-gray-900/60 border ${errors.songName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] placeholder-gray-500`}
              placeholder="Nombre de la canción"
            />
          </div>
          {errors.songName && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.songName}
            </p>
          )}
        </div>
      </div>

      {/* Sección para subir flyer (imagen) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Flyer de la Canción
        </label>
        
        {/* Carga de archivos para imagen */}
        <div className="space-y-2">
          <input
            ref={imageInputRef}
            type="file"
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
            id="flyer-upload"
          />
          
          {!previewImageUrl && !formData.flyer ? (
            <label
              htmlFor="flyer-upload"
              className="flex items-center justify-center px-4 py-8 bg-gray-900/80 border border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 transition-all"
            >
              <div className="text-center">
                <FiImage className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <span className="text-gray-300 block mb-1">Haz clic para subir una imagen</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</span>
              </div>
            </label>
          ) : (
            <div className="relative">
              <div className="relative h-48 w-full bg-gray-900/50 rounded-lg overflow-hidden">
                <img 
                  src={previewImageUrl || formData.flyer} 
                  alt="Vista previa del flyer" 
                  className="h-full w-full object-cover object-center"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://via.placeholder.com/400?text=Error+de+imagen';
                  }}
                />
              </div>

              <div className="absolute top-2 right-2 flex space-x-2">
                <label
                  htmlFor="flyer-upload"
                  className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-colors cursor-pointer"
                  title="Cambiar imagen"
                >
                  <FiImage className="h-5 w-5 text-white" />
                </label>
                <button
                  type="button"
                  onClick={clearImage}
                  className="p-2 bg-red-600/80 rounded-full hover:bg-red-500/80 transition-colors"
                  title="Eliminar imagen"
                >
                  <FiX className="h-5 w-5 text-white" />
                </button>
              </div>
              
              {/* Indicador de carga */}
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white text-sm">Subiendo imagen...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {errors.flyer && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.flyer}
            </p>
          )}
          
          {formData.flyer && !isUploadingImage && (
            <p className="text-xs text-green-500 truncate mt-1">
              Imagen subida correctamente
            </p>
          )}
        </div>
      </div>

      {/* Sección para subir archivo de audio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Archivo de Audio
        </label>
        
        {/* Carga de archivos para audio */}
        <div className="space-y-2">
          <input
            ref={audioInputRef}
            type="file"
            onChange={handleAudioFileChange}
            accept="audio/*"
            className="hidden"
            id="audio-upload"
          />
          
          {!formData.songUrl && !previewAudioName ? (
            <label
              htmlFor="audio-upload"
              className="flex items-center justify-center px-4 py-6 bg-gray-900/80 border border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 transition-all"
            >
              <div className="text-center">
                <FiMusic className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <span className="text-gray-300 block mb-1">Haz clic para subir un archivo de audio</span>
                <span className="text-xs text-gray-500">MP3, WAV, OGG hasta 50MB</span>
              </div>
            </label>
          ) : (
            <div className="relative flex items-center bg-gray-900/50 border border-gray-700 rounded-lg p-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                <FiMusic className="text-[#4EBEFF]" />
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {previewAudioName || formData.songUrl.split('/').pop() || 'Archivo de audio'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {formData.songUrl ? 'Archivo subido' : 'Subiendo archivo...'}
                </p>
              </div>
              
              <div className="flex space-x-2 ml-3">
                {formData.songUrl && (
                  <button
                    type="button"
                    onClick={toggleAudioPlay}
                    className={`p-2 rounded-full ${isPlaying ? 'bg-[#EF5AFF]/20 text-[#EF5AFF]' : 'bg-[#4EBEFF]/20 text-[#4EBEFF]'}`}
                    title={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? <FiPause /> : <FiPlay />}
                  </button>
                )}
                
                <label
                  htmlFor="audio-upload"
                  className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-colors cursor-pointer"
                  title="Cambiar audio"
                >
                  <FiUpload className="h-5 w-5 text-white" />
                </label>
                
                <button
                  type="button"
                  onClick={clearAudio}
                  className="p-2 bg-red-600/80 rounded-full hover:bg-red-500/80 transition-colors"
                  title="Eliminar audio"
                >
                  <FiX className="h-5 w-5 text-white" />
                </button>
              </div>
              
              {/* Indicador de carga */}
              {isUploadingAudio && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white text-sm">Subiendo audio...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {errors.songUrl && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.songUrl}
            </p>
          )}
          
          {formData.songUrl && !isUploadingAudio && (
            <p className="text-xs text-green-500 truncate mt-1">
              Audio subido correctamente
            </p>
          )}
        </div>
      </div>

      {/* Campo de Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="statusActive"
              name="status"
              value="ACTIVE"
              checked={formData.status === 'ACTIVE'}
              onChange={handleChange}
              className="h-4 w-4 bg-gray-900 border-gray-700 focus:ring-[#4EBEFF] text-[#4EBEFF]"
            />
            <label htmlFor="statusActive" className="ml-2 block text-sm text-gray-300">
              Activo
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="statusInactive"
              name="status"
              value="INACTIVE"
              checked={formData.status === 'INACTIVE'}
              onChange={handleChange}
              className="h-4 w-4 bg-gray-900 border-gray-700 focus:ring-[#4EBEFF] text-[#4EBEFF]"
            />
            <label htmlFor="statusInactive" className="ml-2 block text-sm text-gray-300">
              Inactivo
            </label>
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage || isUploadingAudio}
          className="w-full flex justify-center items-center bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] hover:from-[#ff7cff] hover:to-[#75cfff] py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isUploadingImage || isUploadingAudio ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <FiCheck className="mr-2" />
              {initialData ? 'Actualizar canción' : 'Crear canción'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}