export const addressFields = [
  ['postalCode', 'CEP'], ['street', 'Rua'], ['number', 'Número'],
  ['complement', 'Complemento'], ['neighborhood', 'Bairro'],
  ['city', 'Cidade'], ['state', 'UF'],
] as const;

export type Address = Record<(typeof addressFields)[number][0], string>;
export const emptyAddress: Address = {
  postalCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '',
};

export function normalizeAddress(value: Address): Address {
  return {
    postalCode: value.postalCode.replace(/\D/g, ''),
    street: value.street.trim(), number: value.number.trim(),
    complement: value.complement.trim(), neighborhood: value.neighborhood.trim(),
    city: value.city.trim(), state: value.state.trim().toUpperCase(),
  };
}

export function validateAddress(value: Address): string | null {
  const address = normalizeAddress(value);
  if (!Object.values(address).some(Boolean)) return null;
  if (!/^\d{8}$/.test(address.postalCode)) return 'Informe um CEP com 8 dígitos.';
  if (!address.street || !address.number || !address.neighborhood || !address.city) {
    return 'Preencha rua, número (ou S/N), bairro e cidade.';
  }
  if (!/^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/.test(address.state)) {
    return 'Informe uma UF válida, por exemplo SP.';
  }
  if (Object.values(address).some((field) => field.length > 120)) return 'Use até 120 caracteres por campo de endereço.';
  return null;
}

export function formatAddress(address?: Address): string {
  if (!address || !Object.values(address).some(Boolean)) return 'Não informado';
  return [
    [address.street, address.number].filter(Boolean).join(', '), address.complement,
    address.neighborhood, [address.city, address.state].filter(Boolean).join(' - '),
    address.postalCode.replace(/^(\d{5})(\d{3})$/, '$1-$2'),
  ].filter(Boolean).join('\n');
}
