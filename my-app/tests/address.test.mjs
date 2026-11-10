import assert from 'node:assert/strict';
import { test } from 'node:test';
import { emptyAddress, formatAddress, normalizeAddress, validateAddress } from '../src/utils/address.ts';

const address = { postalCode: '01310-100', street: ' Avenida Paulista ', number: 'S/N', complement: '', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'sp' };

test('endereço é opcional e perfis antigos continuam exibíveis', () => {
  assert.equal(validateAddress(emptyAddress), null);
  assert.equal(formatAddress(undefined), 'Não informado');
  assert.equal(formatAddress(emptyAddress), 'Não informado');
});

test('normaliza CEP, espaços e UF e aceita número S/N', () => {
  const normalized = normalizeAddress(address);
  assert.equal(normalized.postalCode, '01310100');
  assert.equal(normalized.street, 'Avenida Paulista');
  assert.equal(normalized.state, 'SP');
  assert.equal(validateAddress(address), null);
  assert.equal(formatAddress(normalized), 'Avenida Paulista, S/N\nBela Vista\nSão Paulo - SP\n01310-100');
});

test('recusa endereço parcial, CEP inválido e UF inexistente', () => {
  assert.ok(validateAddress({ ...emptyAddress, city: 'São Paulo' }));
  assert.ok(validateAddress({ ...address, postalCode: '123' }));
  assert.ok(validateAddress({ ...address, state: 'XX' }));
  assert.ok(validateAddress({ ...address, street: ' ' }));
  assert.ok(validateAddress({ ...address, number: '' }));
});

test('limita tamanho dos campos inclusive complemento', () => {
  assert.ok(validateAddress({ ...address, complement: 'a'.repeat(121) }));
  assert.equal(validateAddress({ ...address, complement: 'a'.repeat(120) }), null);
});
