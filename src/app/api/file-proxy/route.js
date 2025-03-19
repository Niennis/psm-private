import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let filePath = searchParams.get('filePath'); // Ruta del archivo solicitado

  if (filePath.includes('?')) {
    filePath = filePath.split('?')[0]; // Toma solo la parte antes de "?"
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_IMG; // URL base configurada en variables de entorno
  const keyUrl = process.env.NEXT_PUBLIC_KEY_IMG;  // Clave privada configurada en variables de entorno

  if (!filePath) {
    return NextResponse.json({ error: 'Falta el parámetro filePath' }, { status: 400 });
  }

  const fileUrl = `${filePath}${keyUrl}`;
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Error al obtener el archivo' }, { status: response.status });
    }

    const fileBuffer = await response.arrayBuffer();
    
    function inferContentType(filePath) {
      const extension = filePath.split('.').pop().toLowerCase(); // Obtener la extensión
      const mimeTypes = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        pdf: 'application/pdf',
      };
    
      return mimeTypes[extension] || 'application/octet-stream';
    }
    
    const contentType = inferContentType(filePath);

    // Validar y configurar el tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ error: 'Formato de archivo no permitido' }, { status: 415 });
    }
    
    return new Response(fileBuffer, {
      headers: { 'Content-Type': contentType },
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}