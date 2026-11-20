export const addressFields = [
  { key: "postalCode", label: "CEP" },
  { key: "street", label: "Rua" },
  { key: "number", label: "Número" },
  { key: "complement", label: "Complemento" },
  { key: "neighborhood", label: "Bairro" },
  { key: "city", label: "Cidade" },
  { key: "state", label: "UF" },
] as const;

export type AddressKey = (typeof addressFields)[number]["key"];
export type Address = Record<AddressKey, string>;

export const emptyAddress: Address = {
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};
