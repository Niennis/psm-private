
import React, { useState, useEffect, useRef, useMemo } from 'react'
// import { CKEditor } from "@ckeditor/ckeditor5-react";
export const forceDynamic = 'force-dynamic';
import dynamic from 'next/dynamic'


const CKEditorNoSSR = dynamic(
  () => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor),
  {
    ssr: false,
    loading: () => <p>Loading...</p> // Esto puede ayudar a depurar el proceso de carga
  });

import {
  ClassicEditor,
  Alignment,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  Code,
  Essentials,
  FontSize,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageInsertViaUrl,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
} from 'ckeditor5';

const TextEditor = ({ onEditorChange, texto }) => {
  // const [textoHtml, setTextoHtml] = useState('')
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const LICENSE_KEY = 'GPL';

  const [editorLoaded, setEditorLoaded] = useState(false);


  useEffect(() => {
    setEditorLoaded(true);  // Se activará solo en el cliente
  }, []);

  if (typeof window !== 'undefined') {
    require('ckeditor5/dist/ckeditor5.css');
  }

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const plugins = useMemo(() => {
    if (!isLayoutReady) return [];
    return [
      Alignment,
      AutoLink,
      Autosave,
      BlockQuote,
      Bold,
      Code,
      Essentials,
      FontSize,
      Heading,
      HorizontalLine,
      ImageBlock,
      ImageInsertViaUrl,
      ImageToolbar,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      Paragraph,
      RemoveFormat,
      Strikethrough,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Underline,
    ];
  }, [isLayoutReady]);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            'heading',
            'paragraph',
            '|',
            'fontSize',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'bulletedList', 'numberedList',
            '|',
            'horizontalLine',
            'link',
            'insertImageViaUrl',
            'insertTable',
            'blockQuote',
            '|',
            'alignment',
            '|',
            'outdent',
            'indent'
          ],
          shouldNotGroupWhenFull: false
        },
        plugins,
        fontFamily: {
          supportAllValues: true
        },
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 22],
          supportAllValues: true
        },
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph'
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1'
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2'
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3'
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4'
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5'
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6'
            }
          ]
        },
        image: {
          toolbar: ['imageTextAlternative']
        },
        initialData: texto,
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: {
                download: 'file'
              }
            }
          }
        },
        placeholder: 'Escribe tu blog aquí',
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
      }
    };
  }, [isLayoutReady]);

  if (!editorLoaded) {
    return <div>Loading...</div>;  // Mostrar algo mientras se carga
  }


  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    onEditorChange(data);  // Llamamos a la función pasada desde el componente padre
  };

  return (
    <div className='col-12'>
      <CKEditorNoSSR
        editor={ClassicEditor}
        // data="<p>Escribe algo aquí...</p>"
        config={editorConfig}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
        }}
        onChange={handleEditorChange}
        onBlur={(event, editor) => {
        }}
        onFocus={(event, editor) => {
        }}
      />
    </div>
  )
}

export default TextEditor
