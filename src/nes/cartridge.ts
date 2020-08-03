import fs from 'fs';
import Mapper from './mappers/mapper';
import NROM from './mappers/nrom';

const HEADER_SIZE = 16;
const PRGR_BANK_SIZE = 16384;
const CHR_BANK_SIZE = 8192;

export default class Cartridge {
    dataBuffer: Buffer;
    dataArray: Uint8Array;
    headers: Uint8Array;
    banksPRG: number;
    banksCHR: number;
    sizePRG: number;
    sizeCHR: number;
    /**
     * MirrorType
     * 0 = Horizontal
     * 1 = Vertical
     */
    mirrorType: number;
    /**
     * MapperType
     * Gives the id of the mapper
     */
    mapperType: number;
    /** The program */
    PRG: Uint8Array;
    /** The pattern tables */
    CHR: Uint8Array;
    mapper: Mapper;

    constructor(dataBuffer: Buffer) {
        this.dataBuffer = dataBuffer;
        this.dataArray = new Uint8Array(this.dataBuffer);
        this.headers = this.dataArray.subarray(0, HEADER_SIZE);

        this.banksPRG = this.headers[4];
        this.banksCHR = this.headers[5];

        this.sizePRG = this.banksPRG * PRGR_BANK_SIZE;
        this.sizeCHR = this.banksCHR * CHR_BANK_SIZE;

        this.mirrorType = (this.headers[6] & 1);
        this.mapperType = ((this.headers[7] >> 4) << 4) | (this.headers[6] >> 4);

        this.PRG = this.dataArray.subarray(HEADER_SIZE, HEADER_SIZE + this.sizePRG);

        console.log(`Bank size PRG: ${this.banksPRG} Bank size CHR: ${this.banksCHR} Mirror Type: ${this.mirrorType} Mapper Type: ${this.mapperType}`);
        console.log(`Program: ${this.PRG.slice(0, 10)}`);
        
        if (this.sizeCHR > 0) {
            this.CHR = this.dataArray.subarray(HEADER_SIZE + this.sizePRG, HEADER_SIZE + this.sizePRG + this.sizeCHR);
        } else {
            this.CHR = new Uint8Array(CHR_BANK_SIZE);
        }

        console.log(`Pattern set: ${this.CHR.slice(0,10)}`);
        
        switch(this.mapperType) {
            default:
                this.mapper = new NROM(this.banksPRG, this.banksCHR);
                break;
        }
    }

    cpuRead(address: number): number {
        const mappedAddress = this.mapper.cpuMapRead(address);
        return this.PRG[mappedAddress];
    }

    cpuWrite(address: number, value: number) {
        const mappedAddress = this.mapper.cpuMapRead(address);
        this.PRG[mappedAddress] = value;
    }

    ppuRead(address: number): number {
        const mappedAddress = this.mapper.ppuMapRead(address);
        return this.CHR[mappedAddress];
    }

    ppuWrite(address: number, value: number) {
        const mappedAddress = this.mapper.ppuMapRead(address);
        this.CHR[mappedAddress] = value;
    }
}