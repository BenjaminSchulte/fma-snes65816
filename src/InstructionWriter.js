import {FutureNumber, StaticNumber, Calculation} from 'fma';

export default class InstructionWriter {
  static toCalculation(number) {
    switch (number.getClassName()) {
      case 'FutureNumber':
        number = number.getCalculation();
        break;

      default:
        throw new Error('Can not process rel8 with ' + number.getClassName());
    }

    return number;
  }

  static brk(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
    code.writeUInt8(0);
  }

  static impl(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
  }

  static rel8(scope, code, opcode, p1, p2, context) {
    code.writeUInt8(opcode);

    const number = InstructionWriter.toCalculation(p1.value);
    const pc = InstructionWriter.toCalculation(scope.getMember('PC').callWithParameters(context));
    code.writeUInt8(new FutureNumber(new Calculation(new Calculation(number, '-', pc), '-', new StaticNumber(1))));
  }

  static rel16(scope, code, opcode, p1, p2) {
    throw new Error("TODO REL16");
  }

  static mv(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
    code.writeUInt8(p2.value);
    code.writeUInt8(p1.value);
  }

  static im8(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
    code.writeUInt8(p1.value);
  }

  static im16(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
    code.writeUInt16(p1.value);
  }

  static im24(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
    code.writeUInt24(p1.value);
  }

  static im_a(scope, code, opcode, p1, p2, context) {
    const size = scope.getMember('register_size_A').getMember('__value').value;
    if (size === 8) {
      InstructionWriter.im8(scope, code, opcode, p1, p2);
    } else if (size === 16) {
      InstructionWriter.im16(scope, code, opcode, p1, p2);
    } else {
      throw new Error('Invalid size for register A');
    }
  }

  static im_xy(scope, code, opcode, p1, p2) {
    const size = scope.getMember('register_size_XY').getMember('__value').value;
    if (size === 8) {
      InstructionWriter.im8(scope, code, opcode, p1, p2);
    } else if (size === 16) {
      InstructionWriter.im16(scope, code, opcode, p1, p2);
    } else {
      throw new Error('Invalid size for register XY');
    }
  }
}
