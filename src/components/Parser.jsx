import Image from 'next/image';
import parse, { domToReact } from 'html-react-parser';

const ParserImgToImage = ({ htmlContent, classType }) => {
  // Definir el transformador que convierte <img> en <Image>

  const prepareImg = (src) => {
    console.log('SRC', src)

    // const match_base = src.match(new RegExp(process.env.NEXT_PUBLIC_BASE_IMG, 'g'))
    // const match_key = src.match(new RegExp(process.env.NEXT_PUBLIC_KEY_IMG, 'g'))

    /* if(src.match(new Reg)){

    } else */ if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {
      return src
    } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG)) {
      return `${src}${process.env.NEXT_PUBLIC_KEY_IMG}`
    } else if (src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {
      return `${process.env.NEXT_PUBLIC_BASE_IMG}${src}`
    } else if (!src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {
      return `${process.env.NEXT_PUBLIC_BASE_IMG}${src}${process.env.NEXT_PUBLIC_KEY_IMG}`
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
  const content = parse(htmlContent, options);

  return <div>{content}</div>;
};

export default ParserImgToImage;
