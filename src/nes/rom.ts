import fs from 'fs';

const HEADER_SIZE = 16;
const PRGR_BANK_SIZE = 16384;
const CHR_BANK_SIZE = 8192;

export default class ROM {
    path: string;
    dataBuffer: Buffer;
    dataArray: Uint8Array;
    headers: Uint8Array;
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

    constructor(path: string) {
        this.path = path;
        this.dataBuffer = fs.readFileSync(path);
        this.dataArray = new Uint8Array(this.dataBuffer);
        this.headers = this.dataArray.subarray(0, HEADER_SIZE);

        this.sizePRG = this.headers[4] * PRGR_BANK_SIZE;
        this.sizeCHR = this.headers[5] * CHR_BANK_SIZE;

        this.mirrorType = (this.headers[6] & 1);
        this.mapperType = ((this.headers[7] >> 4) << 4) | (this.headers[6] >> 4);

        this.PRG = this.dataArray.subarray(HEADER_SIZE, HEADER_SIZE + this.sizePRG);

        if (this.sizeCHR > 0) {
            this.CHR = this.dataArray.subarray(HEADER_SIZE + this.sizePRG, HEADER_SIZE + this.sizePRG + this.sizeCHR);
        } else {
            this.CHR = new Uint8Array(CHR_BANK_SIZE);
        }


    }
}