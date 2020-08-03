import CPU from "./cpu";
import { isPageCrossed } from "./utils";

export type ADDRESSING_MODE = (cpu: CPU) => number;

export const ADDRESSING_MODES: Record<string, ADDRESSING_MODE> = {
    /** Function is direclty implied and no further operand needs to be specified */
    IMPLIED: (cpu) => {
        return 0;
    },
    /** Some instructions have an option to operate directly upon the accumulator */
    ACCUMULATOR: (cpu) => {
        return cpu.A;
    },
    /** Immediate addressing allows the programmers to directly specify an 8 bit constant within the construction */
    IMMEDIATE: (cpu) => {
        return cpu.PC + 1;
    },
    /** An instruction using zero page addressing mode is limited to address only the first 256 bytes of memory */
    ZERO_PAGE: (cpu) => {
        return cpu.read8(cpu.PC + 1);
    },
    /* IMPORTANT: the address calculation wraps around if the sum exceed $FF (256) */
    /** The instruction address is calculated by taking the 8 bit zero page address and adding the current value of the X register */
    ZERO_PAGE_X: (cpu) => {
        return cpu.read8(cpu.PC + 1 + cpu.X);
    },
    /** The instruction address is calculated by taking the 8 bit zero page address and adding the current value of the Y register  */
    ZERO_PAGE_Y: (cpu) => {
        return cpu.read8(cpu.PC + 1 + cpu.Y);
    },
    /** Relative addressing mode is used by branch instructions which contain a signed 8 bit relative offset which is added to program counter if the condition is true. */
    RELATIVE: (cpu) => {
        const address = cpu.read8(cpu.PC + 1);

        if (address < 0x80) {
            return cpu.PC + 2 + address;
        } else {
            return cpu.PC + 2 + address - 0x100;
        }
    },
    /** Instructions using absolute addressing contain a full 16 bit address to identify the target location */
    ABSOLUTE: (cpu) => {
        return cpu.read16(cpu.PC + 1);
    },
    /** The instruction address is calculated by taking the 16 bit address and adding the current value of the X register */
    ABSOLUTE_X: (cpu) => {
        const address = (cpu.read16(cpu.PC + 1) + cpu.X) & 0xFFFF;

        /** Takes an additional cycle when the address is on a different page */
        if (isPageCrossed(address - cpu.X, address)) {
            cpu.cycles += 1;
        }

        return address;
    },
    /** The instruction address is calculated by taking the 16 bit address and adding the current value of the Y register */
    ABSOLUTE_Y: (cpu) => {
        const address = (cpu.read16(cpu.PC + 1) + cpu.Y) & 0xFFFF;

        /** Takes an additional cycle when the address is on a different page */
        if (isPageCrossed(address - cpu.Y, address)) {
            cpu.cycles += 1;
        }

        return (cpu.read16(cpu.PC + 1) + cpu.Y) & 0xFFFF;
    },
    /** The instruction contains a 16 bit address which identifies the location of the least significant byte of another 16 bit memory address which is the real target of the instruction */
    INDIRECT: (cpu) => {
        return cpu.read16(cpu.read16(cpu.PC + 1));
    },
    /* IMPORTANT: the address calculation wraps around if the sum exceed $FF (256) */
    /** The address of the zero page table is taken from the instruction and the X register added to it to give the location of the least significant byte of the target address */
    INDEXED_INDIRECT_X: (cpu) => {
        return cpu.read16((cpu.read8(cpu.PC + 1) + cpu.X) & 0xFF);
    },
    /** In instruction contains the zero page location of the least significant byte of 16 bit address. The Y register is dynamically added to this value to generate the actual target address */
    INDIRECT_INDEXED_Y: (cpu) => {
        const address = cpu.read16((cpu.read8(cpu.PC + 1) + cpu.Y) & 0xFF);

        /** Takes an additional cycle when the address is on a different page */
        if (isPageCrossed(address - cpu.Y, address)) {
            cpu.cycles += 1;
        }

        return cpu.read16((cpu.read8(cpu.PC + 1) + cpu.Y) & 0xFF);
    },
};

