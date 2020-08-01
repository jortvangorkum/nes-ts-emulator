import CPUMemory from "./cpu_memory";
import { OPCODES } from "./opcodes";
import { ADDRESSING_MODES } from "./addressing_modes";

/** 
 * The CPU is a 6502 microprocessor which is an 8 bit CPU .
 * The processor is little endian
 */
export class CPU {
    cycles: number;
    
    /**
     * The CPU Memory is 2 KB in size.
     * The first 256 byte page of memory ($0000-$00FF) is referred to as 'Zero Page'.
     * The second page of memory ($0100-$01FF) is reserved for the system stack.
     */
    memory: CPUMemory;

    /** The program counter is a 16 bit register. */
    PC: number;

    /** 
     * The stack pointer is an 8 bit register.
     * Pushing bytes to the stack causes the stack pointer to be decremented.
     * Conversely pulling bytes causes it to be incremented.
     */
    SP: number;

    /** The 8 bit accumalator. */
    A: number;

    /** The 8 bit index register X */
    X: number;

    /** The 8 bit index register Y */
    Y: number;

    /** 
     * During instructions a set of processor flags are set or clear to record the results of the operation.
     * Each flag has a single bit within the register.
     */
    flags: {
        /** Carry Flag */
        C: number;
        /** Zero Flag */
        Z: number;
        /** Interupt Disable */
        I: number;
        /** Decimal Mode */
        D: number;
        /** Break Command */
        B: number;
        /** Overflow Flag */
        V: number;
        /** Negative Flag */
        N: number;
    }

    constructor() {
        this.cycles = 0;
        this.memory = new CPUMemory();
        this.PC = 0;
        this.SP = 0;
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.flags = {
            C: 0,
            Z: 0,
            I: 0,
            D: 0,
            B: 0,
            V: 0,
            N: 0,
        };
    }

    tick() {
        const opcode = this.read8(this.PC);
        const [
            instruction,
            addressingMode,
            instructionSize,
            instructionCycles
        ] = OPCODES[opcode];

        const address = addressingMode(this);

        this.PC += instructionSize;
        this.cycles += instructionCycles;

        instruction(address, this);
    }

    /*
     * Memory
     */
    read8(address: number): number {
        return this.memory.read8(address);
    }

    read16(address: number): number {
        return this.memory.read8((address + 1) << 8) | this.memory.read8(address);
    }

    write8(address: number, value: number) {
        this.memory.write8(address, value);
    }

    /*
     * Stack
     */
    stackPush8(value: number) {
        this.memory.stack[this.SP] = value;
        this.SP = (this.SP - 1) & 0xFF; 
    }

    stackPush16(value: number) {
        this.stackPush8(value >> 8);
        this.stackPush8(value & 0xFF);
    }

    stackPull8() {
        this.SP = (this.SP + 1) & 0xFF;
        return this.memory.stack[this.SP];
    }

    stackPull16() {
        return this.stackPull8() | (this.stackPull8() << 8);
    }

    /*
     * Flags
     */
    setZeroFlag(value: number) {
        this.flags.Z = value === 0 ? 1 : 0;
    }

    setNegativeFlag(value: number) {
        this.flags.N = value >> 7;
    }

    getFlags(): number {
        let flags = 0;

        flags |= this.flags.C << 0;
        flags |= this.flags.Z << 1;
        flags |= this.flags.I << 2;
        flags |= this.flags.D << 3;
        flags |= 0 << 4;
        flags |= 1 << 5;
        flags |= this.flags.V << 6;
        flags |= this.flags.N << 7;

        return flags;
    }

    setFlags(value: number) {
        this.flags.C = (value >> 0) & 1;
        this.flags.Z = (value >> 1) & 1;
        this.flags.I = (value >> 2) & 1;
        this.flags.D = (value >> 3) & 1;
        this.flags.V = (value >> 6) & 1;
        this.flags.N = (value >> 7) & 1;
    }
}