import CPUMemory from "./cpu_memory";
import { INSTRUCTIONS, Instruction } from "./instructions";
import Bus from "./bus";

/** 
 * The CPU is a 6502 microprocessor which is an 8 bit CPU .
 * The processor is little endian
 */
export default class CPU {
    cycles: number;

    /** The program counter is a 16 bit register. */
    PC: number;

    /** The bus which is an address lane which combines multiple components */
    bus: Bus;

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
        /** Interrupt Disable */
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

    constructor(bus: Bus) {
        this.cycles = 0;
        this.bus = bus;
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

    tick(): number {
        const oldCycles = this.cycles;
        console.log(`Cycle: ${this.cycles}`);
        
        console.log(`PC: ${this.PC}`);
        const opcode = this.read8(this.PC);
        console.log(`Opcode: ${opcode}`);
        const [
            instruction,
            addressingMode,
            instructionSize,
            instructionCycles
        ]: Instruction = INSTRUCTIONS[opcode];
        
        console.log(`Instruction: ${instruction.name} Addressing mode: ${addressingMode.name} Instruction size: ${instructionSize} Instruction Cycles: ${instructionCycles}`);
        
        const address = addressingMode(this);
        instruction(address, this);
        
        this.PC += instructionSize;
        this.cycles += instructionCycles;

        return this.cycles - oldCycles;
    }

    /**
     * Interrupts
     */
    /** Reset interrupt */
    reset() {
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.SP = 0xFD;
        this.flags = {
            C: 0,
            Z: 0,
            I: 0,
            D: 0,
            B: 0,
            V: 0,
            N: 0,
        }
        this.PC = this.read16(0xFFFC);
    }

    /** Maskable interrupt */
    IRQ() {
        if (this.flags.I === 0) {
            this.stackPush16(this.PC + 1);
            // I do not know why the or with ~0x10 (-17);
            // What I think it does it sets everything except for the carry flag;
            this.stackPush8(this.getFlags() & ~0x10);
            this.flags.I = 1;
            this.PC = this.read16(0xFFFE);
            this.cycles += 7;
        }
    }

    /** Non-maskable interrupt */
    NMI() {
        this.stackPush16(this.PC + 1);
        // I do not know why the or with ~0x10 (-17);
        // What I think it does it sets everything except for the carry flag;
        this.stackPush8(this.getFlags() & ~0x10);
        this.flags.I = 1;
        this.PC = this.read16(0xFFFA);
        this.cycles += 8;
    }

    /*
     * Memory
     */
    read8(address: number): number {
        return this.bus.cpuRead(address);
    }

    read16(address: number): number {
        return (this.bus.cpuRead(address + 1) << 8) | this.bus.cpuRead(address);
    }

    write8(address: number, value: number) {
        this.bus.cpuWrite(address, value);
    }

    /*
     * Stack
     */
    stackPush8(value: number) {
        // TODO: refactor with the bus
        this.bus.cpuMemory.stack[this.SP] = value;
        this.SP = (this.SP - 1) & 0xFF; 
    }

    stackPush16(value: number) {
        this.stackPush8(value >> 8);
        this.stackPush8(value & 0xFF);
    }

    stackPull8() {
        // TOOD: refactor with the bus
        this.SP = (this.SP + 1) & 0xFF;
        return this.bus.cpuMemory.stack[this.SP];
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