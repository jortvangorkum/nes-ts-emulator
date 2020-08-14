import fs from 'fs';
import Bus from '../bus';
import { join } from 'path';


test('Test dummy read', async () => {
    const buffer = fs.readFileSync(join(__dirname, `../../../public/cartridges/adc_1.nes`));
    const nes = new Bus(buffer);
    nes.cpu.reset();
    for (let i = 0; i < 10; i++) {
        nes.clock();
    }
})