// components/podcasts/EpisodeForm.tsx
import { useState, useEffect, useRef } from 'react';
import { FiImage, FiAlertCircle, FiMusic, FiPlay, FiPause, FiUpload, FiX } from 'react-icons/fi';

interface EpisodeFormProps {
  initialData?: {
    title: string;
    image: string;
    audioUrl: string;
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

export default function EpisodeForm({ initialData, onSubmit, isSubmitting }: EpisodeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    audioUrl: ''
  });

  // Estados para la vista previa y reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  // Estados para la carga de archivos
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [previewAudioFile, setPreviewAudioFile] = useState<File | null>(null);
  const [previewAudioName, setPreviewAudioName] = useState<string>('');
  
  // Estados de carga
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  
  // Referencias para los inputs de archivo
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        image: initialData.image || '',
        audioUrl: initialData.audioUrl || ''
      });

      // Si hay una imagen inicial, establecerla como vista previa
      if (initialData.image) {
        setPreviewImageUrl(initialData.image);
      }
    }

    // Limpiar el reproductor de audio cuando se desmonte el componente
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Si se cambia la URL del audio, reiniciar el reproductor
    if (name === 'audioUrl' && audio) {
      audio.pause();
      setIsPlaying(false);
    }

    // Limpiar errores al editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejadores para la carga de archivos
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'El archivo debe ser una imagen' }));
      return;
    }

    // Establecer el archivo y crear una vista previa local
    setPreviewImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
    
    // Limpiar error si existe
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }

    // Subir la imagen automáticamente cuando se selecciona
    await uploadImage(file);
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('audio/')) {
      setErrors(prev => ({ ...prev, audioUrl: 'El archivo debe ser un audio' }));
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
    if (errors.audioUrl) {
      setErrors(prev => ({ ...prev, audioUrl: '' }));
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
        setFormData(prev => ({ ...prev, image: result.url }));
        // Mantener la vista previa pero eliminar el archivo pendiente
        setPreviewImageFile(null);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setErrors(prev => ({ ...prev, image: 'Error al subir la imagen' }));
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
        setFormData(prev => ({ ...prev, audioUrl: result.url }));
        // Eliminar el archivo pendiente pero mantener el nombre para la interfaz
        setPreviewAudioFile(null);
      }
    } catch (error) {
      console.error('Error al subir el audio:', error);
      setErrors(prev => ({ ...prev, audioUrl: 'Error al subir el archivo de audio' }));
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.image && !previewImageFile) newErrors.image = 'La imagen es requerida';
    if (!formData.audioUrl && !previewAudioFile) newErrors.audioUrl = 'El archivo de audio es requerido';
    
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

  const clearImage = () => {
    setPreviewImageFile(null);
    setPreviewImageUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const clearAudio = () => {
    setPreviewAudioFile(null);
    setPreviewAudioName('');
    setFormData(prev => ({ ...prev, audioUrl: '' }));
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
    // Si hay un audio reproduciéndose, detenerlo
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudioPlay = () => {
    if (!formData.audioUrl) return;
    
    if (!audio) {
      const newAudio = new Audio(formData.audioUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
      newAudio.play().then(() => setIsPlaying(true)).catch(err => {
        console.error('Error al reproducir audio:', err);
      });
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        if (audio.src !== formData.audioUrl) {
          audio.src = formData.audioUrl;
        }
        audio.play().catch(err => {
          console.error('Error al reproducir audio:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de título */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Título del Episodio
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full bg-gray-900/50 border ${errors.title ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4EBEFF]`}
          placeholder="Título del episodio"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.title}
          </p>
        )}
      </div>
      
      {/* Campo de imagen con carga de archivos */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Imagen del Episodio
        </label>
        
        {/* Carga de archivos para imagen */}
        <div className="space-y-2">
          <input
            ref={imageInputRef}
            type="file"
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
          
          {!previewImageUrl && !formData.image ? (
            <label
              htmlFor="image-upload"
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
              <div className="relative h-32 w-full bg-gray-900/50 rounded-lg overflow-hidden">
                <img 
                  src={previewImageUrl || formData.image} 
                  alt="Vista previa" 
                  className="h-full w-full object-cover object-center"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://via.placeholder.com/400?text=Error+de+imagen';
                  }}
                />
              </div>

              <div className="absolute top-2 right-2 flex space-x-2">
                <label
                  htmlFor="image-upload"
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
          
          {errors.image && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.image}
            </p>
          )}
          
          {formData.image && (
            <p className="text-xs text-green-500 truncate mt-1">
              Imagen subida correctamente
            </p>
          )}
        </div>
      </div>

      {/* Campo de archivo de audio con carga */}
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
          
          {!formData.audioUrl && !previewAudioName ? (
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
                  {previewAudioName || formData.audioUrl.split('/').pop() || 'Archivo de audio'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {formData.audioUrl ? 'Archivo subido' : 'Subiendo archivo...'}
                </p>
              </div>
              
              <div className="flex space-x-2 ml-3">
                {formData.audioUrl && (
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
          
          {errors.audioUrl && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.audioUrl}
            </p>
          )}
          
          {formData.audioUrl && (
            <p className="text-xs text-green-500 truncate mt-1">
              Audio subido correctamente
            </p>
          )}
        </div>
      </div>
      
      {/* Botón de envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage || isUploadingAudio}
          className="px-4 py-2 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isUploadingImage || isUploadingAudio ? 'Guardando...' : initialData ? 'Actualizar Episodio' : 'Crear Episodio'}
        </button>
      </div>
    </form>
  );
}