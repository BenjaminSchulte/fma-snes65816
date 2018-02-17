export default class InstructionTickCounter {
  constructor() {
    this.reset();
  }

  reset() {
    this.count = 0;
  }

  add(opcode) {
    // add one for average
    this.count += DURATIONS[opcode] + 1;
  }

  addDirect(num) {
    this.count += num;
  }

  get() {
    return this.count;
  }
}

const DURATIONS = {
  0x61: 6,
  0x63: 4,
  0x65: 3,
  0x67: 6,
  0x69: 2,
  0x6D: 4,
  0x6F: 5,
  0x71: 5,
  0x72: 5,
  0x73: 7,
  0x75: 4,
  0x77: 6,
  0x79: 4,
  0x7D: 4,
  0x7F: 5,
  0x21: 6,
  0x23: 4,
  0x25: 3,
  0x27: 6,
  0x29: 2,
  0x2D: 4,
  0x2F: 5,
  0x31: 5,
  0x32: 5,
  0x33: 7,
  0x35: 4,
  0x37: 6,
  0x39: 4,
  0x3D: 4,
  0x3F: 5,
  0x06: 5,
  0x0A: 2,
  0x0E: 6,
  0x16: 6,
  0x1E: 7,
  0x90: 2,
  0xB0: 2,
  0xF0: 2,
  0x24: 3,
  0x2C: 4,
  0x34: 4,
  0x3C: 4,
  0x89: 2,
  0x30: 2,
  0xD0: 2,
  0x10: 2,
  0x80: 3,
  0x00: 7,
  0x82: 4,
  0x50: 2,
  0x70: 2,
  0x18: 2,
  0xD8: 2,
  0x58: 2,
  0xB8: 2,
  0xC1: 6,
  0xC3: 4,
  0xC5: 3,
  0xC7: 6,
  0xC9: 2,
  0xCD: 4,
  0xCF: 5,
  0xD1: 5,
  0xD2: 5,
  0xD3: 7,
  0xD5: 4,
  0xD7: 6,
  0xD9: 4,
  0xDD: 4,
  0xDF: 5,
  0x02: 7,
  0xE0: 2,
  0xE4: 3,
  0xEC: 4,
  0xC0: 2,
  0xC4: 3,
  0xCC: 4,
  0x3A: 2,
  0xC6: 5,
  0xCE: 6,
  0xD6: 6,
  0xDE: 7,
  0xCA: 2,
  0x88: 2,
  0x41: 6,
  0x43: 4,
  0x45: 3,
  0x47: 6,
  0x49: 2,
  0x4D: 4,
  0x4F: 5,
  0x51: 5,
  0x52: 5,
  0x53: 7,
  0x55: 4,
  0x57: 6,
  0x59: 4,
  0x5D: 4,
  0x5F: 5,
  0x1A: 2,
  0xE6: 5,
  0xEE: 6,
  0xF6: 6,
  0xFE: 7,
  0xE8: 2,
  0xC8: 2,
  0x4C: 3,
  0x5C: 4,
  0x6C: 5,
  0x7C: 6,
  0xDC: 6,
  0x20: 6,
  0x22: 8,
  0xFC: 8,
  0xA1: 6,
  0xA3: 4,
  0xA5: 3,
  0xA7: 6,
  0xA9: 2,
  0xAD: 4,
  0xAF: 5,
  0xB1: 5,
  0xB2: 5,
  0xB3: 7,
  0xB5: 4,
  0xB7: 6,
  0xB9: 4,
  0xBD: 4,
  0xBF: 5,
  0xA2: 2,
  0xA6: 3,
  0xAE: 4,
  0xB6: 4,
  0xBE: 4,
  0xA0: 2,
  0xA4: 3,
  0xAC: 4,
  0xB4: 4,
  0xBC: 4,
  0x46: 5,
  0x4A: 2,
  0x4E: 6,
  0x56: 6,
  0x5E: 7,
  0x54: 1,
  0x44: 1,
  0xEA: 2,
  0x01: 6,
  0x03: 4,
  0x05: 3,
  0x07: 6,
  0x09: 2,
  0x0D: 4,
  0x0F: 5,
  0x11: 5,
  0x12: 5,
  0x13: 7,
  0x15: 4,
  0x17: 6,
  0x19: 4,
  0x1D: 4,
  0x1F: 5,
  0xF4: 5,
  0xD4: 6,
  0x62: 6,
  0x48: 3,
  0x8B: 3,
  0x0B: 4,
  0x4B: 3,
  0x08: 3,
  0xDA: 3,
  0x5A: 3,
  0x68: 4,
  0xAB: 4,
  0x2B: 5,
  0x28: 4,
  0xFA: 4,
  0x7A: 4,
  0xC2: 3,
  0x26: 5,
  0x2A: 2,
  0x2E: 6,
  0x36: 6,
  0x3E: 7,
  0x66: 5,
  0x6A: 2,
  0x6E: 6,
  0x76: 6,
  0x7E: 7,
  0x40: 6,
  0x6B: 6,
  0x60: 6,
  0xE1: 6,
  0xE3: 4,
  0xE5: 3,
  0xE7: 6,
  0xE9: 2,
  0xED: 4,
  0xEF: 5,
  0xF1: 5,
  0xF2: 5,
  0xF3: 7,
  0xF5: 4,
  0xF7: 6,
  0xF9: 4,
  0xFD: 4,
  0xFF: 5,
  0x38: 2,
  0xF8: 2,
  0x78: 2,
  0xE2: 3,
  0x81: 6,
  0x83: 4,
  0x85: 3,
  0x87: 6,
  0x8D: 4,
  0x8F: 5,
  0x91: 6,
  0x92: 5,
  0x93: 7,
  0x95: 4,
  0x97: 6,
  0x99: 5,
  0x9D: 5,
  0x9F: 5,
  0xDB: 3,
  0x86: 3,
  0x8E: 4,
  0x96: 4,
  0x84: 3,
  0x8C: 4,
  0x94: 4,
  0x64: 3,
  0x74: 4,
  0x9C: 4,
  0x9E: 5,
  0xAA: 2,
  0xA8: 2,
  0x5B: 2,
  0x1B: 2,
  0x7B: 2,
  0x14: 5,
  0x1C: 6,
  0x04: 5,
  0x0C: 6,
  0x3B: 2,
  0xBA: 2,
  0x8A: 2,
  0x9A: 2,
  0x9B: 2,
  0x98: 2,
  0xBB: 2,
  0xCB: 3,
  0x42: 0,
  0xEB: 3,
  0xFB: 2
}