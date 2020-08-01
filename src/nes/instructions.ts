import { CPU } from "./cpu";
import { isPageCrossed } from "./utils";

export type INSTRUCTION = (address: number, cpu: CPU) => void; 

export const INSTRUCTIONS: Record<string, INSTRUCTION> = {
    /** Add with Carry */
    ADC: (address, cpu) => {
        const a = cpu.A;
        const value = cpu.read8(address);
        cpu.A += value + cpu.flags.C;
        
        /** Carry Flag */
        cpu.flags.C = (cpu.A > 0xFF) ? 1 : 0;

        cpu.setNegativeFlag(cpu.A);

        /** Overflow Flag */
        // Overflow is set if > 127 or < -128
        cpu.flags.V = ((a ^ cpu.A) & (value ^ cpu.A) & 0x80) ? 1 : 0;

        /** Fix overflow */
        cpu.A &= 0xFF;

        cpu.setZeroFlag(cpu.A);
    },
    /** Logical AND */
    AND: (address, cpu) => {
        cpu.A &= cpu.read8(address);

        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Arithmetic Shift Left (Accumulator) */
    ASL_ACC: (address, cpu) => {
        cpu.flags.C = (cpu.A >> 7) & 1;
        cpu.A = (cpu.A << 1) & 0xFF;

        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Arithmetic Shift Left (Memory) */
    ASL: (address, cpu) => {
        let value = cpu.read8(address);
        cpu.flags.C = (value >> 7) & 1;
        value = (value << 1) & 0xFF;

        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.write8(address, value);
    },
    /** Branch if Carry Clear */
    BCC: (address, cpu) => {
        if (cpu.flags.C === 0) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Branch if Carry Set */
    BCS: (address, cpu) => {
        if (cpu.flags.C === 1) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF; 
        }
    },
    /** Branch if Equal */
    BEQ: (address, cpu) => {
        if (cpu.flags.Z === 1) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Bit Test */
    BIT: (address, cpu) => {
        const value = cpu.read8(address);
        cpu.flags.V = (value >> 6) & 1;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(cpu.A & value);
    },
    /** Branch if Minus */
    BMI: (address, cpu) => {
        if (cpu.flags.N === 1) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Branch if Not Equal */
    BNE: (address, cpu) => {
        if (cpu.flags.Z === 0) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Branch if Positive */
    BPL: (address, cpu) => {
        if (cpu.flags.N === 0) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Force Interupt */
    // TODO: http://nesdev.com/the%20'B'%20flag%20&%20BRK%20instruction.txt
    BRK: (address, cpu) => {
        cpu.stackPush16(cpu.PC + 1);
        // I do not know why the or with 0x18 (24);
        cpu.stackPush8(cpu.getFlags() | 0x18);
        cpu.flags.I = 1;
        cpu.PC = cpu.read16(0xFFFE);
    },
    /** Branch if Overflow Clear */
    BVC: (address, cpu) => {
        if (cpu.flags.V === 0) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Branch if Overflow Set */
    BVS: (address, cpu) => {
        if (cpu.flags.V === 1) {
            cpu.cycles += isPageCrossed(address, cpu.PC) ? 2 : 1;
            cpu.PC = address & 0xFFFF;
        }
    },
    /** Clear Carry Flag */
    CLC: (address, cpu) => {
        cpu.flags.C = 0;
    },
    /** Clear Decimal Mode */
    CLD: (address, cpu) => {
        cpu.flags.D = 0;
    },
    /** Clear Interupt Disable */
    CLI: (address, cpu) => {
        cpu.flags.I = 0;
    },
    /** Clear Overflow Flag */
    CLV: (address, cpu) => {
        cpu.flags.V = 0;
    },
    /** Compare */
    CMP: (address, cpu) => {
        const value = cpu.read8(address);
        const sub = cpu.A - value;
        cpu.flags.C = (cpu.A >= value) ? 1 : 0;
        cpu.setNegativeFlag(sub);
        cpu.setZeroFlag(sub);
    },
    /** Compare X Register */
    CPX: (address, cpu) => {
        const value = cpu.read8(address);
        const sub = cpu.X - value;
        cpu.flags.C = (cpu.X >= value) ? 1 : 0;
        cpu.setNegativeFlag(sub);
        cpu.setZeroFlag(sub);
    },
    /** Compare Y Register */
    CPY: (address, cpu) => {
        const value = cpu.read8(address);
        const sub = cpu.Y - value;
        cpu.flags.C = (cpu.Y >= value) ? 1 : 0;
        cpu.setNegativeFlag(sub);
        cpu.setZeroFlag(sub);
    },
    /** Decrement Memory */
    DEC: (address, cpu) => {
        const value = (cpu.read8(address) - 1) & 0xFF;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.write8(address, value);
    },
    /** Decrement X Register */
    DEX: (address, cpu) => {
        const value = (cpu.X - 1) & 0xFF;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.X = value;
    },
    /** Decerement Y Register */
    DEY: (address, cpu) => {
        const value = (cpu.Y - 1) & 0xFF;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.Y = value;
    },
    /** Exclusive OR */
    EOR: (address, cpu) => {
        cpu.A ^= cpu.read8(address);
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Increment Memory */
    INC: (address, cpu) => {
        const value = (cpu.read8(address) + 1) & 0xFF;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.write8(address, value);
    },
    /** Increment X Register */
    INX: (address, cpu) => {
        const value = (cpu.X + 1) & 0xFF;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.X = value;
    },
    /** Increment Y Register */
    INY: (address, cpu) => {
        const value = (cpu.Y + 1) & 0xFF;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.Y = value;
    },
    /** Jump */
    // TODO https://github.com/christopherpow/nes-test-roms/blob/master/stress/NEStress.txt#L141
    JMP: (address, cpu) => {
        cpu.PC = address & 0xFFFF;
    },
    /** Jump to Subroutine */
    JSR: (address, cpu) => {
        cpu.stackPush16(cpu.PC - 1);
        cpu.PC = address & 0xFFFF;
    },
    /** Load Accumulator */
    LDA: (address, cpu) => {
        cpu.A = cpu.read8(address);
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Load X Register */
    LDX: (address, cpu) => {
        cpu.X = cpu.read8(address);
        cpu.setNegativeFlag(cpu.X);
        cpu.setZeroFlag(cpu.X);
    },
    /** Load Y Register */
    LDY: (address, cpu) => {
        cpu.Y = cpu.read8(address);
        cpu.setNegativeFlag(cpu.Y);
        cpu.setZeroFlag(cpu.Y);
    },
    /** Logical Shift Right (Accumulator) */
    LSR_ACC: (address, cpu) => {
        cpu.flags.C = cpu.A & 1;
        cpu.A >>= 1;
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Logical Shift Right (Memory) */
    LSR: (address, cpu) => {
        let value = cpu.read8(address);
        cpu.flags.C = value & 1;
        value >>= 1;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.write8(address, value);
    },
    /** No Operation */
    NOP: (address, cpu) => {},
    /** Logical Inclusive OR */
    ORA: (address, cpu) => {
        cpu.A |= cpu.read8(address);
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Push Accumulator */
    PHA: (address, cpu) => {
        cpu.stackPush8(cpu.A);
    },
    /** Push Processor Status */
    PHP: (address, cpu) => {
        cpu.stackPush8(cpu.getFlags() | 0x10);
    },
    /** Pull Accumulator */
    PLA: (address, cpu) => {
        cpu.A = cpu.stackPull8();
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Pull Processor Status */
    PLP: (address, cpu) => {
        cpu.setFlags((cpu.stackPull8() & 0xEF) | 0x20);
    },
    /** Rotate Left (Accumulator) */
    ROL_ACC: (address, cpu) => {
        const oldC = cpu.flags.C;
        
        cpu.flags.C = (cpu.A >> 7) & 1;
        cpu.A = ((cpu.A << 1) & 0xFF) | oldC;
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Rotate Left (Memory) */
    ROL: (address, cpu) => {
        const oldC = cpu.flags.C;
        let value = cpu.read8(address);

        cpu.flags.C = (value >> 7) & 1;
        value = ((value << 1) & 0xFF) | oldC;
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.write8(address, value); 
    },
    /** Rotate Right (Accumulator) */
    ROR_ACC: (address, cpu) => {
        const oldC = cpu.flags.C;

        cpu.flags.C = cpu.A & 1;
        cpu.A = (cpu.A >> 1) ^ (oldC << 7);
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Rotate Right (Memory) */
    ROR: (address, cpu) => {
        const oldC = cpu.flags.C;
        let value = cpu.read8(address);

        cpu.flags.C = value & 1;
        value = (value >> 1) ^ (oldC << 7);
        cpu.setNegativeFlag(value);
        cpu.setZeroFlag(value);
        cpu.write8(address, value);
    },
    /** Return from Interrupt */
    RTI: (address, cpu) => {
        cpu.setFlags(cpu.stackPull8() | 0x20);
        cpu.PC = cpu.stackPull16();
    },
    /** Return from Subroutine */
    RTS: (address, cpu) => {
        cpu.PC = cpu.stackPull16() + 1;
    },
    /** Subtract with Carry */
    SBC: (address, cpu) => {
        const a = cpu.A;
        const value = cpu.read8(address);
        cpu.A = (cpu.A - value - (1 - cpu.flags.C));
        // Carry Flag
        if (cpu.A > 0xFF) {
            cpu.flags.C = 1;
        } else {
            cpu.flags.C = 0;
        }
        cpu.A &= 0xFF;
        // Overflow Flag
        if ((a ^ cpu.A) & (value ^ cpu.A) & 0x80) {
            cpu.flags.V = 1;
        } else {
            cpu.flags.V = 0;
        }
        cpu.setNegativeFlag(cpu.A);
        cpu.setZeroFlag(cpu.A);
    },
    /** Set Carry Flag */
    SEC: (address, cpu) => {
        cpu.flags.C = 1;
    },
    /** Set Decimal Flag */
    SED: (address, cpu) => {
        cpu.flags.D = 1;
    },
    /** Set Interrupt Disable */
    SEI: (address, cpu) => {
        cpu.flags.I = 1;
    },
    /** Store Accumulator */
    STA: (address, cpu) => {
        cpu.write8(address, cpu.A);
    },
    /** Store X Register */
    STX: (address, cpu) => {
        cpu.write8(address, cpu.X)
    },
    /** Store Y Register */
    STY: (address, cpu) => {
        cpu.write8(address, cpu.Y)
    },
    /** Transfer Accumulator to X */
    TAX: (address, cpu) => {
        cpu.X = cpu.A;
    },
    /** Transfer Accumulator to Y */
    TAY: (address, cpu) => {
        cpu.Y = cpu.A;
    },
    /** Transfer Stack Pointer to X */
    TSX: (address, cpu) => {
        cpu.X = cpu.SP;
    },
    /** Transfer X to Accumulator */
    TXA: (address, cpu) => {
        cpu.A = cpu.X;
    },
    /** Transfer X to Stack Pointer */
    TXS: (address, cpu) => {
        cpu.SP = cpu.X;
    },
    /** Transfer Y to Accumulator */
    TYA: (address, cpu) => {
        cpu.A = cpu.Y;
    },
}