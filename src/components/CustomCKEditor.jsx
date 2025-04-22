// components/CustomCKEditor.js
"use client";

import { useEffect, useState } from 'react';

const CustomCKEditor = ({ onChange, data, ...props }) => {
  const [editor, setEditor] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const LICENSE_KEY = 'GPL';
  
  useEffect(() => {
    const loadEditor = async () => {
      try {
        // Importaciones dinámicas para reducir el impacto
        const { CKEditor } = await import('@ckeditor/ckeditor5-react');
        const ClassicEditorModule = await import('@ckeditor/ckeditor5-build-classic');
        const ClassicEditor = ClassicEditorModule.default;
        
        // Sobrescribimos la configuración para incluir solo lo esencial
        // Esto no reduce el tamaño del bundle pero alivia la carga de memoria
        const editorConfiguration = {
          toolbar: {
            items: [
              'undo', 'redo',
              '|', 'heading',
              '|', 'bold', 'italic',
              '|', 'link', 'insertImage',
              '|', 'bulletedList', 'numberedList'
            ]
          },
          // Configuramos el plugin de imagen para que solo permita URLs
          image: {
            toolbar: ['imageTextAlternative'],
            // Desactivamos el upload de imágenes
            upload: {
              types: []
            }
          },
          licenseKey: LICENSE_KEY,
        };
        
        setEditor({
          CKEditor,
          ClassicEditor,
          config: editorConfiguration
        });
        setIsReady(true);
      } catch (error) {
        console.error("Error al cargar CKEditor:", error);
      }
    };
    
    loadEditor();
  }, []);
  
  useEffect(() => {
    if (isReady && editor) {
      // Personaliza el comportamiento del editor después de que se cargue
      const pluginCollection = editor.ClassicEditor.builtinPlugins;
      
      // Desactiva los plugins de carga de imágenes que no necesitas
      // Esto no reduce el tamaño del bundle pero mejora el rendimiento
      const pluginsToRemove = [
        'CKFinderUploadAdapter', 
        'EasyImage', 
        'Image', 
        'ImageCaption', 
        'ImageStyle', 
        'ImageToolbar', 
        'ImageUpload'
      ];
      
      // Esto es solo para mejorar el rendimiento en tiempo de ejecución
      pluginsToRemove.forEach(plugin => {
        const pluginIndex = pluginCollection.findIndex(p => p.pluginName === plugin);
        if (pluginIndex > -1) {
          pluginCollection.splice(pluginIndex, 1);
        }
      });
    }
  }, [isReady, editor]);
  
  
  if (!isReady) {
    return <div>Cargando editor...</div>;
  }
  return (
    <editor.CKEditor
      editor={editor.ClassicEditor}
      config={editor.config}
      data={data}
      onChange={(event, editorInstance) => {
        const data = editorInstance.getData();
        onChange && onChange(data);
      }}
      {...props}
    />
  );
};

export default CustomCKEditor;