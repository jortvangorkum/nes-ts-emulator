import CPU from "./cpu";
import CPUMemory from "./cpu_memory";

export default class Bus {
    cpu: CPU;
    /**
     * The CPU Memory is 2 KB in size.
     * The first 256 byte page of memory ($0000-$00FF) is referred to as 'Zero Page'.
     * The second page of memory ($0100-$01FF) is reserved for the system stack.
     */
    cpuMemory: CPUMemory;

    constructor() {
        this.cpu = new CPU(this);
        this.cpuMemory = new CPUMemory();
    }

    read(address: number): number {
        if (address < 0x2000) {
            /** The 2KB memory is mirrored 4 times */
            return this.cpuMemory.read8(address);
        }

        return 0;
    }

    write(address: number, value: number) {
        if (address < 0x2000) {
            this.cpuMemory.write8(address, value);
        }
    }
}