export default abstract class Mapper {
    banksPRG: number;
    banksCHR: number;

    constructor(banksPRG: number, banksCHR: number) {
        this.banksPRG = banksPRG;
        this.banksCHR = banksCHR;
    }

    abstract cpuMapRead(address: number): number;
    abstract cpuMapWrite(address: number): number;
    abstract ppuMapRead(address: number): number;
    abstract ppuMapWrite(address: number): number;
}