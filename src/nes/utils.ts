export function isPageCrossed(addr1: number, addr2: number): boolean {
    return (addr1 >> 8) !== (addr2 >> 8);
}