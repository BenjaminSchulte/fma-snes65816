import {Parser, Plugin as CorePlugin} from 'fma';
import Assembler from './Assembler';
import InstructionCompiler from './InstructionCompiler';
import path from 'path';
import FMA_INIT from './snes65816';

export default class Plugin extends CorePlugin {
  constructor() {
    super();

    this.assembler = new Assembler();
  }

  getName() {
    return 'SNES 65816';
  }

  compileAssembler(project, interpreter) {
    const parser = new Parser(project);
    const program = parser.parseString(FMA_INIT);
    interpreter.process(program);
  }

  preProcess(project, interpreter) {
    const instructions = new InstructionCompiler();
    instructions.implementTo(project, interpreter)

    this.compileAssembler(project, interpreter);
  }

  postProcess(project, result) {
    return this.assembler.postProcess(result);
  }

  register(root, interpreter) {
  }
}
