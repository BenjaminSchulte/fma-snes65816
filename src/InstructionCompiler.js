import InstructionType from './InstructionType';
import Instruction from './Instruction';
import InstructionTickCounter from './InstructionTickCounter';
import {MacroObject, ArgumentList, BooleanObject, InternalValue} from 'fma';

class InstructionCollection {
  constructor() {
    this.instructions = {}
  }

  add(name, opcode, type, callback=null) {
    name = name.toUpperCase();

    if (!this.instructions.hasOwnProperty(name)) {
      this.instructions[name] = new Instruction(name);
    }

    this.instructions[name].add(type, opcode, callback);
  }

  compile(project, interpreter) {
    const root = interpreter.getRoot();

    for (let name in this.instructions) {
      root.setMember(name, this.instructions[name].build());
    }
  }
};

export default class InstructionCompiler {
  constructor() {

  }

  setReturnOpcode(scope, opcode, p1, p2, context) {
    scope.setMember('is_return_opcode', new BooleanObject(true));
  }

  setSizeHint(scope, opcode, p1, p2, context) {
    this.setReturnOpcode(scope, opcode, p1, p2, context);

    switch (p1.rawValue.getClassName()) {
    case 'Function':
    case 'Label':
      break;

    default:
      console.log('Size hint on non-function: ' + p1.rawValue.getClassName());
      return;
    }

    const func = p1.rawValue;
    const sizeA = scope.getMember('register_size_A');
    const sizeXY = scope.getMember('register_size_XY');
    func.setMember('register_size_A', sizeA);
    func.setMember('register_size_XY', sizeXY);
  }

  createNumber(context, number) {
    const obj = context.getRoot().resolveChild('Number').getObject();
    const value = new InternalValue(number);

    return obj.getMember('new').callWithParameters(context, value);
  }

  implementTo(project, interpreter) {
    const collection = new InstructionCollection();

    collection.add("BRK", 0x00, InstructionType.brk());
    collection.add("ora", 0x01, InstructionType.idpx());
    collection.add("cop", 0x02, InstructionType.im());
    collection.add("ora", 0x03, InstructionType.sr());
    collection.add("tsb", 0x04, InstructionType.dp());
    collection.add("ora", 0x05, InstructionType.dp());
    collection.add("asl", 0x06, InstructionType.dp());
    collection.add("ora", 0x07, InstructionType.ildp());
    collection.add("ora", 0x09, InstructionType.im_a());
    collection.add("asl", 0x0a, InstructionType.a());
    collection.add("asl", 0x0a, InstructionType.impl());
    collection.add("phd", 0x0b, InstructionType.impl());
    collection.add("tsb", 0x0c, InstructionType.addr());
    collection.add("ora", 0x0d, InstructionType.addr());
    collection.add("asl", 0x0e, InstructionType.addr());
    collection.add("ora", 0x0f, InstructionType.long());
    collection.add("bpl", 0x10, InstructionType.relb());
    collection.add("ora", 0x11, InstructionType.idpy());
    collection.add("ora", 0x12, InstructionType.idp());
    collection.add("ora", 0x13, InstructionType.isry());
    collection.add("trb", 0x14, InstructionType.dp());
    collection.add("ora", 0x15, InstructionType.dpx());
    collection.add("asl", 0x16, InstructionType.dpx());
    collection.add("ora", 0x17, InstructionType.ildpy());
    collection.add("clc", 0x18, InstructionType.impl());
    collection.add("ora", 0x19, InstructionType.addry());
    collection.add("inc", 0x1a, InstructionType.a());
    collection.add("inc", 0x1a, InstructionType.impl());
    collection.add("tcs", 0x1b, InstructionType.impl());
    collection.add("trb", 0x1c, InstructionType.addr());
    collection.add("ora", 0x1d, InstructionType.addrx());
    collection.add("asl", 0x1e, InstructionType.addrx());
    collection.add("ora", 0x1f, InstructionType.longx());
    collection.add("jsr", 0x20, InstructionType.addr_pc());
    collection.add("and", 0x21, InstructionType.idpx());
    collection.add("jsl", 0x22, InstructionType.long());
    collection.add("and", 0x23, InstructionType.sr());
    collection.add("bit", 0x24, InstructionType.dp());
    collection.add("and", 0x25, InstructionType.dp());
    collection.add("rol", 0x26, InstructionType.dp());
    collection.add("and", 0x27, InstructionType.ildp());
    collection.add("AND", 0x29, InstructionType.im_a());
    collection.add("rol", 0x2a, InstructionType.impl());
    collection.add("pld", 0x2b, InstructionType.impl());
    collection.add("bit", 0x2c, InstructionType.addr());
    collection.add("and", 0x2d, InstructionType.addr());
    collection.add("rol", 0x2e, InstructionType.addr());
    collection.add("and", 0x2f, InstructionType.long());
    collection.add("bmi", 0x30, InstructionType.relb());
    collection.add("and", 0x31, InstructionType.idpy());
    collection.add("and", 0x32, InstructionType.idp());
    collection.add("and", 0x33, InstructionType.isry());
    collection.add("bit", 0x34, InstructionType.dpx());
    collection.add("and", 0x35, InstructionType.dpx());
    collection.add("rol", 0x36, InstructionType.dpx());
    collection.add("and", 0x37, InstructionType.ildpy());
    collection.add("sec", 0x38, InstructionType.impl());
    collection.add("and", 0x39, InstructionType.addry());
    collection.add("dec", 0x3a, InstructionType.a());
    collection.add("dec", 0x3a, InstructionType.impl());
    collection.add("tsc", 0x3b, InstructionType.impl());
    collection.add("bit", 0x3c, InstructionType.addrx());
    collection.add("and", 0x3d, InstructionType.addrx());
    collection.add("rol", 0x3e, InstructionType.addrx());
    collection.add("and", 0x3f, InstructionType.longx());
    collection.add("rti", 0x40, InstructionType.impl(), (...args) => { this.setReturnOpcode(...args); });
    collection.add("eor", 0x41, InstructionType.idpx());
    collection.add("wdm", 0x42, InstructionType.im());
    collection.add("eor", 0x43, InstructionType.sr());
    collection.add("mvp", 0x44, InstructionType.mv());
    collection.add("eor", 0x45, InstructionType.dp());
    collection.add("lsr", 0x46, InstructionType.dp());
    collection.add("eor", 0x47, InstructionType.ildp());
    collection.add("pha", 0x48, InstructionType.impl());
    collection.add("eor", 0x49, InstructionType.im_a());
    collection.add("lsr", 0x4a, InstructionType.a());
    collection.add("lsr", 0x4a, InstructionType.impl());
    collection.add("phk", 0x4b, InstructionType.impl());
    collection.add("JMP", 0x4c, InstructionType.addr(), (...args) => { this.setSizeHint(...args); });
    collection.add("eor", 0x4d, InstructionType.addr());
    collection.add("lsr", 0x4e, InstructionType.addr());
    collection.add("eor", 0x4f, InstructionType.long());
    collection.add("bvc", 0x50, InstructionType.relb());
    collection.add("eor", 0x51, InstructionType.idpy());
    collection.add("eor", 0x52, InstructionType.idp());
    collection.add("eor", 0x53, InstructionType.isry());
    collection.add("mvn", 0x54, InstructionType.mv());
    collection.add("eor", 0x55, InstructionType.dpx());
    collection.add("lsr", 0x56, InstructionType.dpx());
    collection.add("eor", 0x57, InstructionType.ildpy());
    collection.add("cli", 0x58, InstructionType.impl());
    collection.add("eor", 0x59, InstructionType.addry());
    collection.add("phy", 0x5a, InstructionType.impl());
    collection.add("tcd", 0x5b, InstructionType.impl());
    collection.add("JML", 0x5c, InstructionType.alias(InstructionType.addr(), InstructionType.long()), (...args) => { this.setSizeHint(...args); });
    collection.add("JML", 0x5c, InstructionType.long(), (...args) => { this.setSizeHint(...args); });
    collection.add("eor", 0x5d, InstructionType.addrx());
    collection.add("lsr", 0x5e, InstructionType.addrx());
    collection.add("eor", 0x5f, InstructionType.longx());
    collection.add("RTS", 0x60, InstructionType.impl(), (...args) => { this.setReturnOpcode(...args); });
    collection.add("adc", 0x61, InstructionType.idpx());
    collection.add("per", 0x62, InstructionType.relw());
    collection.add("adc", 0x63, InstructionType.sr());
    collection.add("stz", 0x64, InstructionType.dp());
    collection.add("adc", 0x65, InstructionType.dp());
    collection.add("ror", 0x66, InstructionType.dp());
    collection.add("adc", 0x67, InstructionType.ildp());
    collection.add("pla", 0x68, InstructionType.impl());
    collection.add("ADC", 0x69, InstructionType.im_a());
    collection.add("ror", 0x6a, InstructionType.impl());
    collection.add("rtl", 0x6b, InstructionType.impl(), (...args) => { this.setReturnOpcode(...args); });

    collection.add("adc", 0x6d, InstructionType.addr());

    collection.add("ror", 0x6e, InstructionType.addr());
    collection.add("adc", 0x6f, InstructionType.long());
    collection.add("bvs", 0x70, InstructionType.relb());
    collection.add("adc", 0x71, InstructionType.idpy());
    collection.add("adc", 0x72, InstructionType.idp());
    collection.add("adc", 0x73, InstructionType.isry());
    collection.add("stz", 0x74, InstructionType.dpx());
    collection.add("adc", 0x75, InstructionType.dpx());
    collection.add("ror", 0x76, InstructionType.dpx());
    collection.add("adc", 0x77, InstructionType.ildpy());
    collection.add("sei", 0x78, InstructionType.impl());
    collection.add("adc", 0x79, InstructionType.addry());
    collection.add("ply", 0x7a, InstructionType.impl());
    collection.add("tdc", 0x7b, InstructionType.impl());
    collection.add("jmp", 0x7c, InstructionType.iaddrx());
    collection.add("adc", 0x7d, InstructionType.addrx());
    collection.add("ror", 0x7e, InstructionType.addrx());
    collection.add("adc", 0x7f, InstructionType.longx());
    collection.add("bra", 0x80, InstructionType.relb(), (...args) => { this.setReturnOpcode(...args); });
    collection.add("sta", 0x81, InstructionType.idpx());
    collection.add("brl", 0x82, InstructionType.relw(), (...args) => { this.setReturnOpcode(...args); });
    collection.add("sta", 0x83, InstructionType.sr());
    collection.add("sty", 0x84, InstructionType.dp());
    collection.add("sta", 0x85, InstructionType.dp());
    collection.add("stx", 0x86, InstructionType.dp());
    collection.add("sta", 0x87, InstructionType.ildp());
    collection.add("dey", 0x88, InstructionType.impl());
    collection.add("bit", 0x89, InstructionType.im_a());
    collection.add("txa", 0x8a, InstructionType.impl());
    collection.add("phb", 0x8b, InstructionType.impl());
    collection.add("sty", 0x8c, InstructionType.addr());
    collection.add("sta", 0x8d, InstructionType.addr());
    collection.add("stx", 0x8e, InstructionType.addr());
    collection.add("sta", 0x8f, InstructionType.long());
    collection.add("bcc", 0x90, InstructionType.relb());
    collection.add("blt", 0x90, InstructionType.relb());
    collection.add("sta", 0x91, InstructionType.idpy());
    collection.add("sta", 0x92, InstructionType.idp());
    collection.add("sta", 0x93, InstructionType.isry());
    collection.add("sty", 0x94, InstructionType.dpx());
    collection.add("sta", 0x95, InstructionType.dpx());
    collection.add("stx", 0x96, InstructionType.dpy());
    collection.add("sta", 0x97, InstructionType.ildpy());
    collection.add("tya", 0x98, InstructionType.impl());
    collection.add("sta", 0x99, InstructionType.addry());
    collection.add("txs", 0x9a, InstructionType.impl());
    collection.add("txy", 0x9b, InstructionType.impl());
    collection.add("stz", 0x9c, InstructionType.addr());
    collection.add("sta", 0x9d, InstructionType.addrx());
    collection.add("stz", 0x9e, InstructionType.addrx());
    collection.add("sta", 0x9f, InstructionType.longx());
    collection.add("LDY", 0xa0, InstructionType.im_y());
    collection.add("lda", 0xa1, InstructionType.idpx());
    collection.add("LDX", 0xa2, InstructionType.im_x());
    collection.add("lda", 0xa3, InstructionType.sr());
    collection.add("ldy", 0xa4, InstructionType.dp());
    collection.add("lda", 0xa5, InstructionType.dp());
    collection.add("ldx", 0xa6, InstructionType.dp());
    collection.add("lda", 0xa7, InstructionType.ildp());
    collection.add("tay", 0xa8, InstructionType.impl());
    collection.add("LDA", 0xa9, InstructionType.im_a());
    collection.add("tax", 0xaa, InstructionType.impl());
    collection.add("plb", 0xab, InstructionType.impl());
    collection.add("ldy", 0xac, InstructionType.addr());
    collection.add("lda", 0xad, InstructionType.addr());
    collection.add("ldx", 0xae, InstructionType.addr());
    collection.add("lda", 0xaf, InstructionType.long());
    collection.add("bcs", 0xb0, InstructionType.relb());
    collection.add("bge", 0xb0, InstructionType.relb());
    collection.add("lda", 0xb1, InstructionType.idpy());
    collection.add("lda", 0xb2, InstructionType.idp());
    collection.add("lda", 0xb3, InstructionType.isry());
    collection.add("ldy", 0xb4, InstructionType.dpx());
    collection.add("lda", 0xb5, InstructionType.dpx());
    collection.add("ldx", 0xb6, InstructionType.dpy());
    collection.add("lda", 0xb7, InstructionType.ildpy());
    collection.add("clv", 0xb8, InstructionType.impl());
    collection.add("lda", 0xb9, InstructionType.addry());
    collection.add("tsx", 0xba, InstructionType.impl());
    collection.add("tyx", 0xbb, InstructionType.impl());
    collection.add("ldy", 0xbc, InstructionType.addrx());
    collection.add("lda", 0xbd, InstructionType.addrx());
    collection.add("ldx", 0xbe, InstructionType.addry());
    collection.add("lda", 0xbf, InstructionType.longx());
    collection.add("CPY", 0xc0, InstructionType.im_y());
    collection.add("cmp", 0xc1, InstructionType.idpx());
    collection.add("REP", 0xc2, InstructionType.im(), (scope, opcode, p1, p2, context) => {
      const value = p1.value.getMember('__value').value;

      if (value & 0x10) {
        scope.setMember('register_size_XY', this.createNumber(context, 16));
      }

      if (value & 0x20) {
        scope.setMember('register_size_A', this.createNumber(context, 16));
      }
    });
    collection.add("cmp", 0xc3, InstructionType.sr());
    collection.add("cpy", 0xc4, InstructionType.dp());
    collection.add("cmp", 0xc5, InstructionType.dp());
    collection.add("dec", 0xc6, InstructionType.dp());
    collection.add("cmp", 0xc7, InstructionType.ildp());
    collection.add("iny", 0xc8, InstructionType.impl());
    collection.add("cmp", 0xc9, InstructionType.im_a());
    collection.add("dex", 0xca, InstructionType.impl());
    collection.add("wai", 0xcb, InstructionType.impl());
    collection.add("cpy", 0xcc, InstructionType.addr());
    collection.add("cmp", 0xcd, InstructionType.addr());
    collection.add("dec", 0xce, InstructionType.addr());
    collection.add("cmp", 0xcf, InstructionType.long());
    collection.add("bne", 0xd0, InstructionType.relb());
    collection.add("bnz", 0xd0, InstructionType.relb());
    collection.add("cmp", 0xd1, InstructionType.idpy());
    collection.add("cmp", 0xd2, InstructionType.idp());
    collection.add("cmp", 0xd3, InstructionType.isry());
    collection.add("pei", 0xd4, InstructionType.dp());
    collection.add("cmp", 0xd5, InstructionType.dpx());
    collection.add("dec", 0xd6, InstructionType.dpx());
    collection.add("cmp", 0xd7, InstructionType.ildpy());
    collection.add("cld", 0xd8, InstructionType.impl());
    collection.add("cmp", 0xd9, InstructionType.addry());
    collection.add("phx", 0xda, InstructionType.impl());
    collection.add("stp", 0xdb, InstructionType.impl());
    collection.add("cmp", 0xdd, InstructionType.addrx());
    collection.add("dec", 0xde, InstructionType.addrx());
    collection.add("cmp", 0xdf, InstructionType.longx());
    collection.add("cpx", 0xe0, InstructionType.im_x());
    collection.add("sbc", 0xe1, InstructionType.idpx());
    collection.add("sep", 0xe2, InstructionType.im(), (scope, opcode, p1, p2, context) => {
      const value = p1.value.getMember('__value').value;

      if (value & 0x10) {
        scope.setMember('register_size_XY', this.createNumber(context, 8));
      }

      if (value & 0x20) {
        scope.setMember('register_size_A', this.createNumber(context, 8));
      }
    });

    collection.add("sbc", 0xe3, InstructionType.sr());
    collection.add("cpx", 0xe4, InstructionType.dp());
    collection.add("sbc", 0xe5, InstructionType.dp());
    collection.add("inc", 0xe6, InstructionType.dp());
    collection.add("sbc", 0xe7, InstructionType.ildp());
    collection.add("inx", 0xe8, InstructionType.impl());
    collection.add("sbc", 0xe9, InstructionType.im_a());
    collection.add("nop", 0xea, InstructionType.impl());
    collection.add("xba", 0xeb, InstructionType.impl());
    collection.add("cpx", 0xec, InstructionType.addr());
    collection.add("sbc", 0xed, InstructionType.addr());
    collection.add("inc", 0xee, InstructionType.addr());
    collection.add("sbc", 0xef, InstructionType.long());
    collection.add("beq", 0xf0, InstructionType.relb());
    collection.add("bze", 0xf0, InstructionType.relb());
    collection.add("sbc", 0xf1, InstructionType.idpy());
    collection.add("sbc", 0xf2, InstructionType.idp());
    collection.add("sbc", 0xf3, InstructionType.isry());
    collection.add("pea", 0xf4, InstructionType.im_16());
    collection.add("sbc", 0xf5, InstructionType.dpx());
    collection.add("inc", 0xf6, InstructionType.dpx());
    collection.add("sbc", 0xf7, InstructionType.ildpy());
    collection.add("sed", 0xf8, InstructionType.impl());
    collection.add("sbc", 0xf9, InstructionType.addry());
    collection.add("plx", 0xfa, InstructionType.impl());
    collection.add("xce", 0xfb, InstructionType.impl());
    collection.add("jsr", 0xfc, InstructionType.iaddrx());
    collection.add("sbc", 0xfd, InstructionType.addrx());
    collection.add("inc", 0xfe, InstructionType.addrx());
    collection.add("sbc", 0xff, InstructionType.longx());

    collection.compile(project, interpreter)

    this.createCallback(interpreter, 'SNES65816_start_instruction_counter', [], (context, self) => {
      Instruction.pushCounter(new InstructionTickCounter());
    })
    this.createCallback(interpreter, 'SNES65816_end_instruction_counter', [], (context, self) => {
      const oldCounter = Instruction.popCounter();
      const counter = Instruction.getCounter();
      if (counter) {
        counter.addDirect(counter.get());
      }
      return this.createNumber(context, oldCounter.get());
    })
  }

  createCallback(interpreter, name, argList, callback) {
    const macro = new MacroObject(name);
    const args = new ArgumentList();
    args.buildFromStringList(argList);
    macro.setArguments(args);
    macro.setCallback(callback)

    interpreter.getRoot().setMember(name, macro);
  }
}
