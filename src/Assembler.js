import {LinkerResult, PluginAssembler} from 'fma';
import BufferSizeModifier from './BufferSizeModifier'
import ChecksumCalculator from './ChecksumCalculator'

export default class Assembler extends PluginAssembler {
  getName() {
    return 'SNES 65816';
  }

  postProcess(result) {
    const applicationAddress = result.getSymbols().get('.rom_header_location');
    const romAddress = result.getRomCalculator().getRomAddress(applicationAddress);
    const headerOffset = result.getRomCalculator().getRomOffset(romAddress);

    const sizeFixer = new BufferSizeModifier();
    const buffer = sizeFixer.resize(result.getBinary(), headerOffset);

    const calculator = new ChecksumCalculator();
    calculator.calculate(buffer, headerOffset);

    result = result.clone();
    result.binary = buffer;

    return result;
  }
}
