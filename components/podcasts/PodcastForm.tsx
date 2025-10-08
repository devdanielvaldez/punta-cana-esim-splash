// components/podcasts/PodcastForm.tsx
import { useState, useEffect, useRef } from 'react';
import { FiImage, FiAlertCircle, FiUpload, FiX } from 'react-icons/fi';

interface PodcastFormProps {
  initialData?: {
    name: string;
    description: string;
    image: string;
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

export default function PodcastForm({ initialData, onSubmit, isSubmitting }: PodcastFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        image: initialData.image || ''
      });

      // Si hay una imagen inicial, establecerla como vista previa
      if (initialData.image) {
        setPreviewUrl(initialData.image);
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Limpiar errores al editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'El archivo debe ser una imagen' }));
      return;
    }

    // Establecer el archivo y crear una vista previa local
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Limpiar error si existe
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }

    // Subir la imagen automáticamente cuando se selecciona
    await uploadImage(file);
  };

  // Función para manejar la subida de la imagen
  const uploadImage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      // Subir archivo y obtener respuesta
      const result = await uploadFileService.uploadFile(file);
      
      // Si la carga fue exitosa y tenemos una URL
      if (result && result.url) {
        console.log('URL de imagen obtenida:', result.url);
        // Actualizar el estado del formulario con la URL
        setFormData(prev => ({ ...prev, image: result.url }));
        // Mantener la vista previa pero eliminar el archivo pendiente
        setPreviewFile(null);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setErrors(prev => ({ ...prev, image: 'Error al subir la imagen' }));
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.image && !previewFile) newErrors.image = 'La imagen es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si hay un archivo pendiente de subir, subirlo primero
    if (previewFile) {
      await uploadImage(previewFile);
    }
    
    // Validar y enviar el formulario
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const clearImage = () => {
    setPreviewFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4EBEFF]`}
          placeholder="Nombre del podcast"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.name}
          </p>
        )}
      </div>
      
      {/* Campo de imagen con carga de archivos */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Imagen
        </label>
        
        {/* Carga de archivos */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="file-upload"
          />
          
          {!previewUrl && !formData.image ? (
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center px-4 py-8 bg-gray-900/80 border border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 transition-all"
            >
              <div className="text-center">
                <FiUpload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <span className="text-gray-300 block mb-1">Haz clic para subir una imagen</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</span>
              </div>
            </label>
          ) : (
            <div className="relative">
              <div className="relative h-48 bg-gray-900/50 rounded-lg overflow-hidden">
                <img 
                  src={previewUrl || formData.image} 
                  alt="Vista previa" 
                  className="h-full w-full object-cover object-center"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://via.placeholder.com/800x400?text=Error+de+imagen';
                  }}
                />
              </div>

              <div className="absolute top-2 right-2 flex space-x-2">
                <label
                  htmlFor="file-upload"
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
              {isUploading && (
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
          
          {/* Mostrar la URL obtenida (solo durante desarrollo) */}
          {formData.image && (
            <p className="text-xs text-green-500 truncate mt-1">
              Imagen subida correctamente
            </p>
          )}
        </div>
      </div>
      
      {/* Campo de descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={5}
          className={`w-full bg-gray-900/50 border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4EBEFF]`}
          placeholder="Descripción del podcast..."
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.description}
          </p>
        )}
      </div>
      
      {/* Botón de envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-4 py-2 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isUploading ? 'Guardando...' : initialData ? 'Actualizar Podcast' : 'Crear Podcast'}
        </button>
      </div>
    </form>
  );
}