export default class CPUMemory {
    /** The first 256 byte page of memory ($0000-$00FF) is referred to as 'Zero Page' and is the focus of a number of special addressing modes that result in shorter (and quicker) instructions or allow indirect access to the memory. */
    ZP: Uint8Array;

    /** The second page of memory ($0100-$01FF) is reserved for the system stack and which cannot be relocated. */
    stack: Uint8Array;

    /** The remaining memory space for the CPU  */
    ram: Uint8Array;

    constructor() {
        this.ZP = new Uint8Array(256);
        this.stack = new Uint8Array(256);
        this.ram = new Uint8Array(1536);
    }

    read8(address: number): number {
        address = address % 0x800;
        if (address < 0x100) {
            return this.ZP[address];
        } else if (address < 0x200) {
            return this.stack[address - 0x100];
        } else {
            return this.ram[address - 0x200];
        }
    }

    write8(address: number, value: number) {
        address = address % 0x800;
        if (address < 0x100) {
            this.ZP[address] = value;
        } else if (address < 0x200) {
            this.stack[address - 0x100] = value;
        } else {
            this.ram[address - 0x200] = value;
        }
    }
}