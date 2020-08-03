import CPU from "./cpu";
import CPUMemory from "./cpu_memory";
import Cartridge from "./cartridge";

export default class Bus {
    cpu: CPU;
    /**
     * The CPU Memory is 2 KB in size.
     * The first 256 byte page of memory ($0000-$00FF) is referred to as 'Zero Page'.
     * The second page of memory ($0100-$01FF) is reserved for the system stack.
     */
    cpuMemory: CPUMemory;

    cartridge: Cartridge;

    constructor(dataBuffer: Buffer) {
        this.cpu = new CPU(this);
        this.cpuMemory = new CPUMemory();
        this.cartridge = new Cartridge(dataBuffer);
    }

    cpuRead(address: number): number {
        /** The 2KB memory is mirrored 4 times */
        if (address < 0x2000) {
            return this.cpuMemory.read(address);
        } 
        /** The cartridge is from 0x6000 - 0xFFFF */
        else {
            return this.cartridge.cpuRead(address);
        }
    }

    cpuWrite(address: number, value: number) {
        /** The 2KB memory is mirrored 4 times */
        if (address < 0x2000) {
            this.cpuMemory.write(address, value);
        } 
        /** The cartridge is from 0x6000 - 0xFFFF */
        else {
            this.cartridge.cpuWrite(address, value);
        }
    }

    clock() {
        this.cpu.tick();
    }
}