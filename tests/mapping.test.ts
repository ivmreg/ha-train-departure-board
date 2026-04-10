// tests/mapping.test.ts
import { getStockCategory } from '../src/utils';

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
  } catch (e) {
    console.error(`❌ FAIL: ${name}`);
    console.error(e);
    process.exit(1);
  }
}

test('maps City Beam correctly', () => {
  const result = getStockCategory('City Beam');
  if (result.label !== 'CITY BEAM') throw new Error(`Expected CITY BEAM, got ${result.label}`);
});

test('maps null correctly', () => {
  const result = getStockCategory(null);
  if (result.category !== 'standard') throw new Error(`Expected standard, got ${result.category}`);
});
