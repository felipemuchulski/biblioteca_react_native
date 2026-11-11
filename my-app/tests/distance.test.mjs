import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateDistance, formatDistance, isValidCoordinates } from '../src/utils/distance.ts';

const origin = { latitude: 0, longitude: 0 };

test('mesmo ponto e coordenadas zero são válidos', () => {
  assert.equal(isValidCoordinates(origin), true);
  assert.equal(calculateDistance(origin, origin), 0);
});

test('um grau no equador mede aproximadamente 111,195 km e é simétrico', () => {
  const destination = { latitude: 0, longitude: 1 };
  const distance = calculateDistance(origin, destination);
  assert.ok(Math.abs(distance - 111195.08) < 1);
  assert.equal(distance, calculateDistance(destination, origin));
});

test('São Paulo até Rio de Janeiro mede aproximadamente 361 km em linha reta', () => {
  const distance = calculateDistance(
    { latitude: -23.5505, longitude: -46.6333 },
    { latitude: -22.9068, longitude: -43.1729 },
  );
  assert.ok(distance > 360000 && distance < 362000);
});

test('cruza o antimeridiano pelo caminho mais curto e aceita antípodas', () => {
  const distance = calculateDistance({ latitude: 0, longitude: 179.9 }, { latitude: 0, longitude: -179.9 });
  assert.ok(Math.abs(distance - 22239.02) < 1);
  assert.ok(Math.abs(calculateDistance(origin, { latitude: 0, longitude: 180 }) - 20015114.44) < 1);
});

test('não calcula distância com pontos ausentes ou inválidos', () => {
  for (const invalid of [null, undefined, {}, { latitude: 91, longitude: 0 },
    { latitude: 0, longitude: -181 }, { latitude: NaN, longitude: 0 },
    { latitude: 0, longitude: Infinity }, { latitude: '0', longitude: 0 }]) {
    assert.equal(isValidCoordinates(invalid), false);
    assert.equal(calculateDistance(origin, invalid), null);
    assert.equal(calculateDistance(invalid, origin), null);
  }
});

test('formata metros e quilômetros em português e trata ausência de distância', () => {
  assert.equal(formatDistance(0), 'Menos de 1 m');
  assert.equal(formatDistance(800.4), '800 m');
  assert.equal(formatDistance(1000), '1,0 km');
  assert.equal(formatDistance(1234), '1,2 km');
  for (const invalid of [null, undefined, NaN, Infinity, -1]) {
    assert.equal(formatDistance(invalid), 'Distância indisponível');
  }
});
