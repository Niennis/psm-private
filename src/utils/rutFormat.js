export const formatAndValidateRUT = (rutInput) => {
  // 1. Limpia el RUT (deja solo números y K)
  const cleanedRUT = rutInput.replace(/[^0-9kK]/g, '').toUpperCase();

  // 2. Valida largo mínimo
  if (cleanedRUT.length < 8) return { formattedRUT: rutInput, isValid: false };

  // 3. Separa cuerpo y dígito
  const body = cleanedRUT.slice(0, -1);
  const dv = cleanedRUT.slice(-1);

  // 4. Valida DV (algoritmo chileno)
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDV = (11 - (sum % 11)).toString();
  const realDV = dv === 'K' ? '10' : dv === '0' ? '11' : dv;
  const isValid = expectedDV === realDV;

  // 5. Formatea con puntos y guión (opcional)
  let formattedRUT = rutInput;
  if (isValid) {
    formattedRUT = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  }

  return { formattedRUT, isValid };
};