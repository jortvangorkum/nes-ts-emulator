import fs from 'fs';
import Bus from '../bus';
import { join } from 'path';

const buffer = fs.readFileSync(join(__dirname, `../../../public/cartridges/adc_1.nes`));
const nes = new Bus(buffer);

beforeEach(() => {
    nes.cpu.reset();
})

test('Read from NES file', async () => {
    for (let i = 0; i < 10; i++) {
        nes.clock();
    }
})