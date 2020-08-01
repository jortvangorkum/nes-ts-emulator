/** 
 * The CPU is a 6502 microprocessor which is an 8 bit CPU .
 * The processor is little endian
 */
export class CPU {
    /**
     * The first 256 byte page of memory ($0000-$00FF) is referred to as 'Zero Page'.
     * The second page of memory ($0100-$01FF) is reserved for the system stack.
     * The only other reserved locations in the memory map are the very last 6 bytes ($FFFA-$FFFF).
     *      The addresses of the non-maskable interrupt handler ($FFFA/B)
     *      The power on reset location ($FFFC/D)
     *      The BRK/interrupt request handler ($FFFE/F)
     */
    memory: Uint8Array;

    /** The program counter is a 16 bit register. */
    PC: number;

    /** 
     * The stack pointer is an 8 bit register.
     * Pushing bytes to the stack causes the stack pointer to be decremented.
     * Conversely pulling bytes causes it to be incremented.
     */
    SP: number;

    /** The stack is 256 bytes between $0100 - $01FF */
    stack: Uint8Array;

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

    constructor() {
        this.memory = new Uint8Array(64 * 1024);
        this.PC = 0;
        this.SP = 0;
        this.stack = new Uint8Array(256);
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
    
    setZeroFlag(value: number) {
        this.flags.Z = value === 0 ? 1 : 0;
    }

    setNegativeFlag(value: number) {
        this.flags.N = value >> 7;
    }
}