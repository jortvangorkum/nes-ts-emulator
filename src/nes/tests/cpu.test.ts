import fs from 'fs';
import Bus from '../bus';


test('Test dummy read', async () => {
    const buffer = fs.readFileSync('/home/jort/Documents/Github/nes-ts-emulator/public/cartridges/adc_1.nes');
    const nes = new Bus(buffer);
    for (let i = 0; i < 20; i++) {
        nes.clock();
    }
})