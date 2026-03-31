import Image from 'next/image';
import parse, { domToReact } from 'html-react-parser';

const ParserImgToImage = ({ htmlContent, classType }) => {
  // Definir el transformador que convierte <img> en <Image>

  const normalizarTexto = (texto) => {
    // Expresiones regulares dinámicas para base y key
    const baseRegex = new RegExp(`(${process.env.NEXT_PUBLIC_BASE_IMG})`, "i");
    const removeInterrogationMark = process.env.NEXT_PUBLIC_KEY_IMG.split('?')[1]
    const keyRegex = new RegExp(removeInterrogationMark, "i");

    // Expresión regular para la URL (nombre de archivo de imagen con extensión)
    const urlRegex = /(\b\w+\.(jpg|png|gif|jpeg|webp)\b)/i;

    // Extraer las partes
    const baseMatch = texto.match(baseRegex) || process.env.NEXT_PUBLIC_BASE_IMG;
    const urlMatch = texto.match(urlRegex);
    const keyMatch = texto.match(keyRegex) || process.env.NEXT_PUBLIC_KEY_IMG;

    // Obtener los valores únicos (en caso de que haya duplicados)
    const base = typeof baseMatch === 'string' ? baseMatch : baseMatch[1];
    const url = urlMatch[1];
    const key = typeof keyMatch === 'string' ? keyMatch : keyMatch[1];

    // Reconstruir el texto en el orden correcto
    return `${base}${url}${key}`;
  }

  const prepareImg = (src) => {
    const match_base = src.match(new RegExp(process.env.NEXT_PUBLIC_BASE_IMG)) || [];
    const removeInterrogationMark = process.env.NEXT_PUBLIC_KEY_IMG.split('?')[1]
    const match_key = src.match(new RegExp(removeInterrogationMark)) || []

    if (match_base.length > 1 || match_key.length > 1) {
      normalizarTexto(src)
    } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && src.includes('https://reposaludmental.blob.core.windows.net/test/') && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

      return `/api/file-proxy?filePath=${src}`
    } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {
      const removeKey = src.split('?')[0]
      return `/api/file-proxy?filePath=${removeKey}`
    } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

      return `/api/file-proxy?filePath=${src}`
    } else if (src.includes(process.env.NEXT_PUBLIC_KEY_IMG) && !src.includes(process.env.NEXT_PUBLIC_BASE_IMG)) {

      return `/api/file-proxy?filePath=${process.env.NEXT_PUBLIC_BASE_IMG}${src}`
    } else if (!src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

      return `/api/file-proxy?filePath=${process.env.NEXT_PUBLIC_BASE_IMG}${src}`
    }
  }

  const options = {
    replace: (domNode) => {
      if (domNode.name === 'img') {
        const { src, alt, width, class: className } = domNode.attribs;
        return (
          <div className={className}>
            <Image
              // src={src}
              src={prepareImg(src)}
              alt={alt || 'Image'}
              width={0}
              height={0}
              sizes='100%'
              style={{
                layout: width === '100%' ? 'responsive' : 'intrinsic',
                width: '50%',
                height: 'auto'
              }}
            />
          </div>
        );
      }
    },
  };

  // Usar html-react-parser para convertir el HTML a JSX
  if (!htmlContent) return null;
  const content = parse(htmlContent, options);

  return <div>{content}</div>;
};

export default ParserImgToImage;
