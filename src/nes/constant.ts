import { CPU } from "./cpu"

export enum ADDRESSING_MODES {
    /** Function is direclty implied and no further operand needs to be specified */
    IMPLIED,
    /** Some instructions have an option to operate directly upon the accumulator */
    ACCUMULATOR,
    /** Immediate addressing allows the programmers to directly specify an 8 bit constant within the construction */
    IMMEDIATE,
    /** An instruction using zero page addressing mode is limited to address only the first 256 bytes of memory */
    ZERO_PAGE,
    /* IMPORTANT: the address calculation wraps around if the sum exceed $FF (256) */
    /** The instruction address is calculated by taking the 8 bit zero page address and adding the current value of the X register */
    ZERO_PAGE_X,
    /** The instruction address is calculated by taking the 8 bit zero page address and adding the current value of the Y register  */
    ZERO_PAGE_Y,
    /** Relative addressing mode is used by branch instructions which contain a signed 8 bit relative offset which is added to program counter if the condition is true. */
    RELATIVE,
    /** Instructions using absolute addressing contain a full 16 bit address toidentify the target location */
    ABSOLUTE,
    /** The instruction address is calculated by taking the 16 bit address and adding the current value of the X register */
    ABSOLUTE_X,
    /** The instruction address is calculated by taking the 16 bit address and adding the current value of the Y register */
    ABSOLUTE_Y,
    /** The instruction contains a 16 bit address which identifies the location of the least significant byte of another 16 bit memory address which is the real target of the instruction */
    INDIRECT,
    /* IMPORTANT: the address calculation wraps around if the sum exceed $FF (256) */
    /** The address of the zero page table is taken from the instruction and the X register added to it to give the location of the least significant byte of the target address */
    INDEXED_INDIRECT_X,
    /** In instruction contains the zero page location of the least significant byte of 16 bit address. The Y register is dynamically added to this value to generate the actual target address */
    INDIRECT_INDEXED_Y,
};

type Instruction = (address: number, cpu: CPU) => void; 

export const INSTRUCTION_SET: Record<string, Instruction> = {
    /** Add with Carry */
    ADC: (address, cpu) => {},
    /** Logical AND */
    AND: (address, cpu) => {},
    /** Arithmeitc Shift Left */
    ASL: (address, cpu) => {},
    /** Branch if Carry Clear */
    BCC: (address, cpu) => {},
    /** Branch if Carry Set */
    BCS: (address, cpu) => {},
    /** Branch if Equal */
    BEQ: (address, cpu) => {},
    /** Bit Test */
    BIT: (address, cpu) => {},
    /** Branch if Minus */
    BMI: (address, cpu) => {},
    /** Branch if Not Equal */
    BNE: (address, cpu) => {},
    /** Branch if Positive */
    BPL: (address, cpu) => {},
    /** Force Interupt */
    BRK: (address, cpu) => {},
    /** Branch if Overflow Clear */
    BVC: (address, cpu) => {},
    /** Branch if Overflow Set */
    BVS: (address, cpu) => {},
    /** Clear Carry Flag */
    CLC: (address, cpu) => {},
    /** Clear Decimal Mode */
    CLD: (address, cpu) => {},
    /** Clear Interupt Disable */
    CLI: (address, cpu) => {},
    /** Clear Overflow Flag */
    CLV: (address, cpu) => {},
    /** Compare */
    CMP: (address, cpu) => {},
    /** Compare X Register */
    CPX: (address, cpu) => {},
    /** Compare Y Register */
    CPY: (address, cpu) => {},
    /** Decrement Memory */
    DEC: (address, cpu) => {},
    /** Decrement X Register */
    DEX: (address, cpu) => {},
    /** Decerement Y Register */
    DEY: (address, cpu) => {},
    /** Exclusive OR */
    EOR: (address, cpu) => {},
    /** Increment Memory */
    INC: (address, cpu) => {},
    /** Increment X Register */
    INX: (address, cpu) => {},
    /** Increment Y Register */
    INY: (address, cpu) => {},
    /** Jump */
    JMP: (address, cpu) => {},
    /** Jump to Subroutine */
    JSR: (address, cpu) => {},
    /** Load Accumulator */
    LDA: (address, cpu) => {},
    /** Load X Register */
    LDX: (address, cpu) => {},
    /** Load Y Register */
    LDY: (address, cpu) => {},
    /** Logical Shift Right */
    LSR: (address, cpu) => {},
    /** No Operation */
    NOP: (address, cpu) => {},
    /** Logical Inclusive OR */
    ORA: (address, cpu) => {},
    /** Push Accumulator */
    PHA: (address, cpu) => {},
    /** Push Processor Status */
    PHP: (address, cpu) => {},
    /** Pull Accumulator */
    PLA: (address, cpu) => {},
    /** Pull Processor Status */
    PLP: (address, cpu) => {},
    /** Rotate Left */
    ROL: (address, cpu) => {},
    /** Rotate Right */
    ROR: (address, cpu) => {},
    /** Return from Interrupt */
    RTI: (address, cpu) => {},
    /** Return from Subroutine */
    RTS: (address, cpu) => {},
    /** Subtract with Carry */
    SBC: (address, cpu) => {},
    /** Set Carry Flag */
    SEC: (address, cpu) => {},
    /** Set Decimal Flag */
    SED: (address, cpu) => {},
    /** Set Interrupt Disable */
    SEI: (address, cpu) => {},
    /** Store Accumulator */
    STA: (address, cpu) => {},
    /** Store X Register */
    STX: (address, cpu) => {},
    /** Store Y Register */
    STY: (address, cpu) => {},
    /** Transfer Accumulator to X */
    TAX: (address, cpu) => {},
    /** Transfer Accumulator to Y */
    TAY: (address, cpu) => {},
    /** Transfer Stack Pointer to X */
    TSX: (address, cpu) => {},
    /** Transfer X to Accumulator */
    TXA: (address, cpu) => {},
    /** Transfer X to Stack Pointer */
    TXS: (address, cpu) => {},
    /** Transfer Y to Accumulator */
    TYA: (address, cpu) => {},
}

type Bytes = number;
type Cycles = number;

interface OpcodeMap {
    [opcode: number]: [Instruction, ADDRESSING_MODES, Bytes, Cycles];
}

export const OPCODES: OpcodeMap = {
    /* Instruction ADC */
    0x69: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0x65: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x75: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0x6D: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0x7D: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0x79: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0x61: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0x71: [INSTRUCTION_SET.ADC, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /* Instruction AND */
    0x29: [INSTRUCTION_SET.AND, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0x25: [INSTRUCTION_SET.AND, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x35: [INSTRUCTION_SET.AND, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0x2D: [INSTRUCTION_SET.AND, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0x3D: [INSTRUCTION_SET.AND, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0x39: [INSTRUCTION_SET.AND, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0x21: [INSTRUCTION_SET.AND, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0x31: [INSTRUCTION_SET.AND, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /** Instruction ASL */
    0x0A: [INSTRUCTION_SET.ASL, ADDRESSING_MODES.ACCUMULATOR, 1, 2],
    0x06: [INSTRUCTION_SET.ASL, ADDRESSING_MODES.ZERO_PAGE, 2, 5],
    0x16: [INSTRUCTION_SET.ASL, ADDRESSING_MODES.ZERO_PAGE_X, 2, 6],
    0x0E: [INSTRUCTION_SET.ASL, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    0x1E: [INSTRUCTION_SET.ASL, ADDRESSING_MODES.ABSOLUTE_X, 3, 7],
    /** Instruction BCC */
    0x90: [INSTRUCTION_SET.BCC, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BCS */
    0xB0: [INSTRUCTION_SET.BCS, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BEQ */
    0xF0: [INSTRUCTION_SET.BEQ, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BIT */
    0x24: [INSTRUCTION_SET.BIT, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x2C: [INSTRUCTION_SET.BIT, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    /** Instruction BMI */
    0x30: [INSTRUCTION_SET.BMI, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BNE */
    0xD0: [INSTRUCTION_SET.BNE, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BPL */
    0x10: [INSTRUCTION_SET.BPL, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BRK */
    0x00: [INSTRUCTION_SET.BRK, ADDRESSING_MODES.IMPLIED, 1, 7],
    /** Instruction BVC */
    0x50: [INSTRUCTION_SET.BVC, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction BVS */
    0x70: [INSTRUCTION_SET.BVS, ADDRESSING_MODES.RELATIVE, 2, 2],
    /** Instruction CLC */
    0x18: [INSTRUCTION_SET.CLC, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction CLD */
    0xD8: [INSTRUCTION_SET.CLD, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction CLI */
    0x58: [INSTRUCTION_SET.CLI, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction CLV */
    0xB8: [INSTRUCTION_SET.CLV, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction CMP */
    0xC9: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xC5: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xD5: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0xCD: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0xDD: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0xD9: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0xC1: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0xD1: [INSTRUCTION_SET.CMP, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /** Instruction CPX */
    0xE0: [INSTRUCTION_SET.CPX, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xE4: [INSTRUCTION_SET.CPX, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xEC: [INSTRUCTION_SET.CPX, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    /** Instruction CPY */
    0xC0: [INSTRUCTION_SET.CPY, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xC4: [INSTRUCTION_SET.CPY, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xCC: [INSTRUCTION_SET.CPY, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    /** Instruction DEC */
    0xC6: [INSTRUCTION_SET.DEC, ADDRESSING_MODES.ZERO_PAGE, 2, 5],
    0xD6: [INSTRUCTION_SET.DEC, ADDRESSING_MODES.ZERO_PAGE_X, 2, 6],
    0xCE: [INSTRUCTION_SET.DEC, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    0xDE: [INSTRUCTION_SET.DEC, ADDRESSING_MODES.ABSOLUTE_X, 3, 7],
    /** Instruction DEX */
    0xCA: [INSTRUCTION_SET.DEX, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction DEY */
    0x88: [INSTRUCTION_SET.DEY, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction EOR */
    0x49: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0x45: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x55: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0x4D: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0x5D: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0x59: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0x41: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0x51: [INSTRUCTION_SET.EOR, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /** Instruction INC */
    0xE6: [INSTRUCTION_SET.INC, ADDRESSING_MODES.ZERO_PAGE, 2, 5],
    0xF6: [INSTRUCTION_SET.INC, ADDRESSING_MODES.ZERO_PAGE_X, 2, 6],
    0xEE: [INSTRUCTION_SET.INC, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    0xFE: [INSTRUCTION_SET.INC, ADDRESSING_MODES.ABSOLUTE_X, 3, 7],
    /** Instruction INX */
    0xE8: [INSTRUCTION_SET.INX, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction INY */
    0xC8: [INSTRUCTION_SET.INY, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction JMP */
    0x4C: [INSTRUCTION_SET.JMP, ADDRESSING_MODES.ABSOLUTE, 3, 3],
    0x6C: [INSTRUCTION_SET.JMP, ADDRESSING_MODES.INDIRECT, 3, 5],
    /** Instruction JSR */
    0x20: [INSTRUCTION_SET.JSR, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    /** Instruction LDA */
    0xA9: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xA5: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xB5: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0xAD: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0xBD: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0xB9: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0xA1: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0xB1: [INSTRUCTION_SET.LDA, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /** Instruction LDX */
    0xA2: [INSTRUCTION_SET.LDX, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xA6: [INSTRUCTION_SET.LDX, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xB6: [INSTRUCTION_SET.LDX, ADDRESSING_MODES.ZERO_PAGE_Y, 2, 4],
    0xAE: [INSTRUCTION_SET.LDX, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0xBE: [INSTRUCTION_SET.LDX, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    /** Instruction LDY */
    0xA0: [INSTRUCTION_SET.LDY, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xA4: [INSTRUCTION_SET.LDY, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xB4: [INSTRUCTION_SET.LDY, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0xAC: [INSTRUCTION_SET.LDY, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0xBC: [INSTRUCTION_SET.LDY, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    /** Instruction LSR */
    0x4A: [INSTRUCTION_SET.LSR, ADDRESSING_MODES.ACCUMULATOR, 1, 2],
    0x46: [INSTRUCTION_SET.LSR, ADDRESSING_MODES.ZERO_PAGE, 2, 5],
    0x56: [INSTRUCTION_SET.LSR, ADDRESSING_MODES.ZERO_PAGE_X, 2, 6],
    0x4E: [INSTRUCTION_SET.LSR, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    0x5E: [INSTRUCTION_SET.LSR, ADDRESSING_MODES.ABSOLUTE_X, 3, 7],
    /** Instruction NOP */
    0xEA: [INSTRUCTION_SET.NOP, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction ORA */
    0x09: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0x05: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x15: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0x0D: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0x1D: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0x19: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0x01: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0x11: [INSTRUCTION_SET.ORA, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /** Instruction PHA */
    0x48: [INSTRUCTION_SET.PHA, ADDRESSING_MODES.IMPLIED, 1, 3],
    /** Instruction PHP */
    0x08: [INSTRUCTION_SET.PHP, ADDRESSING_MODES.IMPLIED, 1, 3],
    /** Instruction PLA */
    0x68: [INSTRUCTION_SET.PLA, ADDRESSING_MODES.IMPLIED, 1, 4],
    /** Instruction PLP */
    0x28: [INSTRUCTION_SET.PLP, ADDRESSING_MODES.IMPLIED, 1, 4],
    /** Instruction ROL */
    0x2A: [INSTRUCTION_SET.ROL, ADDRESSING_MODES.ACCUMULATOR, 1, 2],
    0x26: [INSTRUCTION_SET.ROL, ADDRESSING_MODES.ZERO_PAGE, 2, 5],
    0x36: [INSTRUCTION_SET.ROL, ADDRESSING_MODES.ZERO_PAGE_X, 2, 6],
    0x2E: [INSTRUCTION_SET.ROL, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    0x3E: [INSTRUCTION_SET.ROL, ADDRESSING_MODES.ABSOLUTE_X, 3, 7],
    /** Instruction ROR */
    0x6A: [INSTRUCTION_SET.ROR, ADDRESSING_MODES.ACCUMULATOR, 1, 2],
    0x66: [INSTRUCTION_SET.ROR, ADDRESSING_MODES.ZERO_PAGE, 2, 5],
    0x76: [INSTRUCTION_SET.ROR, ADDRESSING_MODES.ZERO_PAGE_X, 2, 6],
    0x6E: [INSTRUCTION_SET.ROR, ADDRESSING_MODES.ABSOLUTE, 3, 6],
    0x7E: [INSTRUCTION_SET.ROR, ADDRESSING_MODES.ABSOLUTE_X, 3, 7],
    /** Instruction RTI */
    0x40: [INSTRUCTION_SET.RTI, ADDRESSING_MODES.IMPLIED, 1, 6],
    /** Instruction RTS */
    0x60: [INSTRUCTION_SET.RTS, ADDRESSING_MODES.IMPLIED, 1, 6],
    /** Instruction SBC */
    0xE9: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.IMMEDIATE, 2, 2],
    0xE5: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0xF5: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0xED: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0xFD: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.ABSOLUTE_X, 3, 4],
    0xF9: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.ABSOLUTE_Y, 3, 4],
    0xE1: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0xF1: [INSTRUCTION_SET.SBC, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 5],
    /** Instruction SEC */
    0x38: [INSTRUCTION_SET.SEC, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction SED */
    0xF8: [INSTRUCTION_SET.SED, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction SEI */
    0x78: [INSTRUCTION_SET.SEI, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction STA */
    0x85: [INSTRUCTION_SET.STA, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x95: [INSTRUCTION_SET.STA, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0x8D: [INSTRUCTION_SET.STA, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    0x9D: [INSTRUCTION_SET.STA, ADDRESSING_MODES.ABSOLUTE_X, 3, 5],
    0x99: [INSTRUCTION_SET.STA, ADDRESSING_MODES.ABSOLUTE_Y, 3, 5],
    0x81: [INSTRUCTION_SET.STA, ADDRESSING_MODES.INDEXED_INDIRECT_X, 2, 6],
    0x91: [INSTRUCTION_SET.STA, ADDRESSING_MODES.INDIRECT_INDEXED_Y, 2, 6],
    /** Instruction STX */
    0x86: [INSTRUCTION_SET.STX, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x96: [INSTRUCTION_SET.STX, ADDRESSING_MODES.ZERO_PAGE_Y, 2, 4],
    0x8E: [INSTRUCTION_SET.STX, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    /** Instruction STY */
    0x84: [INSTRUCTION_SET.STY, ADDRESSING_MODES.ZERO_PAGE, 2, 3],
    0x94: [INSTRUCTION_SET.STY, ADDRESSING_MODES.ZERO_PAGE_X, 2, 4],
    0x8C: [INSTRUCTION_SET.STY, ADDRESSING_MODES.ABSOLUTE, 3, 4],
    /** Instruction TAX */
    0xAA: [INSTRUCTION_SET.TAX, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction TAY */
    0xA8: [INSTRUCTION_SET.TAY, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction TSX */
    0xBA: [INSTRUCTION_SET.TSX, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction TXA */
    0x8A: [INSTRUCTION_SET.TXA, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction TXS */
    0x9A: [INSTRUCTION_SET.TXS, ADDRESSING_MODES.IMPLIED, 1, 2],
    /** Instruction TYA */
    0x98: [INSTRUCTION_SET.TYA, ADDRESSING_MODES.IMPLIED, 1, 2],
}