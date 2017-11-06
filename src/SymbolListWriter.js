export default class SymbolListWriter {
  constructor(symbols, commands) {
    this.symbols = symbols;
    this.commands = commands;
  }

  write() {
    var result = [];

    var pad = "0000"

    result.push('[labels]');
    const symbols = this.symbols.all();
    for (let name in symbols) {
      const fullAddress = symbols[name];

      const bank = (fullAddress >> 16).toString(16);
      const address = (fullAddress & 0xFFFF).toString(16);

      result.push(`${pad.substr(0,2-bank.length)}${bank}:${pad.substr(0,4-address.length)}${address} ${name}`);
    }

    result.push('')
    if (this.commands.all().length) {
      result.push('[debug]');

      var index = 0;
      for (let command of this.commands.all()) {
        var indexStr = index.toString(16);
        result.push(`${pad.substr(0,4-indexStr.length)}${indexStr} ${command}`);
        index++;
      }
    }

    return result.join("\n")
  }
}
