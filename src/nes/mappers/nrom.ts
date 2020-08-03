import Mapper from "./mapper";

export default class NROM extends Mapper {
    cpuMapRead(address: number): number {
        return address % (this.banksPRG > 1 ? 0x8000 : 0x4000); 
    }

    cpuMapWrite(address: number): number {
        return address % (this.banksPRG > 1 ? 0x8000 : 0x4000); 
    }

    ppuMapRead(address: number): number {
        return address;
    }

    ppuMapWrite(address: number): number {
        return address;
    }
}