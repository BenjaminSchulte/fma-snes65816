import * as Parameter from './InstructionParameter';
import InstructionWriter from './InstructionWriter';

export default class InstructionType {
  constructor(p1, p2, writer) {
    if (writer === undefined || p1 === undefined || p2 === undefined) {
      throw new Error('Missing parameter');
    }

    this.p1 = p1;
    this.p2 = p2;
    this.writer = writer;
  }

  static alias(when, equals) {
    return new InstructionType(
      when.p1,
      when.p2,
      equals.writer
    );
  }

  static brk() {
    return new InstructionType(
      Parameter.NONE,
      Parameter.NONE,
      InstructionWriter.brk
    )
  }

  static addr() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.NONE,
      InstructionWriter.im16
    )
  }

  static mv() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.ADDRESS,
      InstructionWriter.mv
    )
  }

  static addr_pc() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.NONE,
      InstructionWriter.im16
    )
  }

  static iaddrx() {
    return new InstructionType(
      Parameter.INDIRECT_X,
      Parameter.NONE,
      InstructionWriter.im16
    )
  }

  static addrx() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.X,
      InstructionWriter.im16
    )
  }

  static addry() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.Y,
      InstructionWriter.im16
    )
  }

  static impl() {
    return new InstructionType(
      Parameter.NONE,
      Parameter.NONE,
      InstructionWriter.impl
    )
  }

  static a() {
    return new InstructionType(
      Parameter.A,
      Parameter.NONE,
      InstructionWriter.impl
    )
  }

  static idp() {
    return new InstructionType(
      Parameter.INDIRECT,
      Parameter.NONE,
      InstructionWriter.im8
    )
  }

  static isry() {
    return new InstructionType(
      Parameter.__FUTURE,
      Parameter.__FUTURE,
      null
    )
  }

  static idpx() {
    return new InstructionType(
      Parameter.INDIRECT,
      Parameter.X,
      InstructionWriter.im8
    )
  }

  static dpx() {
    return new InstructionType(
      Parameter.DP,
      Parameter.X,
      InstructionWriter.im8
    )
  }

  static idpy() {
    return new InstructionType(
      Parameter.INDIRECT,
      Parameter.Y,
      InstructionWriter.im8
    )
  }

  static dpy() {
    return new InstructionType(
      Parameter.DP,
      Parameter.Y,
      InstructionWriter.im8
    )
  }

  static ildpy() {
    return new InstructionType(
      Parameter.LONG_INDIRECT,
      Parameter.Y,
      InstructionWriter.im8
    )
  }

  static im() {
    return new InstructionType(
      Parameter.CONSTANT,
      Parameter.NONE,
      InstructionWriter.im8
    )
  }

  static im_16() {
    return new InstructionType(
      Parameter.CONSTANT,
      Parameter.NONE,
      InstructionWriter.im16
    )
  }

  static im_a() {
    return new InstructionType(
      Parameter.CONSTANT,
      Parameter.NONE,
      InstructionWriter.im_a
    )
  }

  static im_x() {
    return new InstructionType(
      Parameter.CONSTANT,
      Parameter.NONE,
      InstructionWriter.im_xy
    )
  }

  static im_y() {
    return new InstructionType(
      Parameter.CONSTANT,
      Parameter.NONE,
      InstructionWriter.im_xy
    )
  }

  static sr() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.S,
      InstructionWriter.im8
    )
  }

  static dp() {
    return new InstructionType(
      Parameter.DP,
      Parameter.NONE,
      InstructionWriter.im8
    )
  }

  static ildp() {
    return new InstructionType(
      Parameter.LONG_INDIRECT,
      Parameter.NONE,
      InstructionWriter.im8
    )
  }

  static long() {
    return new InstructionType(
      Parameter.LONG_ADDRESS,
      Parameter.NONE,
      InstructionWriter.im24
    )
  }

  static longx() {
    return new InstructionType(
      Parameter.LONG_ADDRESS,
      Parameter.X,
      InstructionWriter.im24
    )
  }

  static relb() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.NONE,
      InstructionWriter.rel8
    )
  }

  static relw() {
    return new InstructionType(
      Parameter.ADDRESS,
      Parameter.NONE,
      InstructionWriter.rel16
    )
  }
}
