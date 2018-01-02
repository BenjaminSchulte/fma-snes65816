import {ArgumentList, Nil, MacroObject} from 'fma';
import * as ParameterType from './InstructionParameter';
import {BooleanObject} from 'fma';

class Code {
  constructor(code) {
    this.code = code;

    this.writeUInt8 = this._write({
      static: function(code, value) {code.writeUInt8(value);},
      calc: function(code, value) {code.writeCalculation(value, 1);}
    });

    this.writeUInt16 = this._write({
      static: function(code, value) {
        code.writeUInt16LE(value);
      },
      calc: function(code, value) {code.writeCalculation(value, 2);}
    });

    this.writeUInt24 = this._write({
      static: function(code, value) {
        code.writeUInt16LE(value & 0xFFFF);
        code.writeUInt8(value >> 16);
      },
      calc: function(code, value) {code.writeCalculation(value, 3);}
    });
  }

  _write(callbacks) {
    const writeStatic = callbacks.static;
    const writeCalc = callbacks.calc;
    const code = this.code;

    return function(number) {
      if (typeof number === 'number') {
        writeStatic(code.code, number);
      } else {
        switch (number.getClassName()) {
          case 'Number':
            writeStatic(code.code, number.getMember('__value').value);
            break;

          case 'FutureNumber':
            writeCalc(code, number.getCalculation());
            break;

          default:
            throw new Error('Class ' + number.getClassName() + ' can not be written directly');
        }
      }
    };
  };
}

class Parameter {
  constructor(context, object) {
    this.context = context;
    this.rawValue = object;

    this.parse(context, object);
  }

  toNumber(context, object) {
    if (object.hasMember('to_future_number')) {
      return object.getMember('to_future_number').callWithParameters(context);
    } else if (object.hasMember('to_n')) {
      return object.getMember('to_n').callWithParameters(context);
    } else {
      throw new Error('Unknown how to convert to number: ' + object.getClassName());
    }
  }

  parse(context, object) {
    if (object.isNil()) {
      this.type = ParameterType.NONE;
      return;
    }

    const klass = object.getClassName();

    if (klass === 'TypedNumber') {
      const type = object.getMember('type').getMember('__value').value;

      this.value = object.getMember('number');

      switch (type) {
        case 'constant':
          this.type = ParameterType.CONSTANT;
          break;

        case 'direct_page':
          this.type = ParameterType.DP;
          break;

        case 'long_address':
          if (this.value.getClassName() === 'TypedNumber') {
            const other = new Parameter(context, this.value);
            this.value = other.value;

            switch (other.type) {
              case ParameterType.INDIRECT: this.type = ParameterType.LONG_INDIRECT; break;
              default:
              throw new Error('Can not convert: ' + other.type);
            }
          } else {
            this.type = ParameterType.LONG_ADDRESS;
            return;
          }
          break;

        case 'indirect':
          const param = object.getMember('parameter').getClassName();
          switch (param) {
            case 'Nil': this.type = ParameterType.INDIRECT; break;
            case 'Register':
              const name = object.getMember('parameter').getMember('name').getMember('__value').value;
              switch (name) {
                case 'X': this.type = ParameterType.INDIRECT_X; break;
                case 'Y': this.type = ParameterType.INDIRECT_Y; break;
                case 'S': this.type = ParameterType.INDIRECT_S; break;
                default: throw new Error('Unknown register: ' + name);
              }
              break;
            default: throw new Error('Unknown indirect type: ' + param);
          }
          break;

        default:
          throw new Error('Unknown parameter for instruction: ' + object.getClassName());
      }
    } else if (klass === 'Register') {
      switch (object.getMember('name').getMember('__value').value) {
        case 'A': this.type = ParameterType.A; break;
        case 'X': this.type = ParameterType.X; break;
        case 'Y': this.type = ParameterType.Y; break;
        case 'S': this.type = ParameterType.S; break;
        default:
          throw new Error('Unknown register');
      }
    } else {
      this.type = ParameterType.ADDRESS;
      this.value = this.toNumber(context, object);
    }
  }
}

export default class Instruction {
  constructor(name) {
    this.name = name;

    this.alternatives = {}
  }

  add(type, opcode, callback) {
    if (!this.alternatives.hasOwnProperty(type.p1)) {
      this.alternatives[type.p1] = {}
    }

    this.alternatives[type.p1][type.p2] = {type, opcode, callback};
  }

  invoke(context, p1, p2) {
    if (!this.alternatives.hasOwnProperty(p1.type) || !this.alternatives[p1.type].hasOwnProperty(p2.type)) {
      throw new Error('The instruction ' + this.name + ' does not support the given parameters: ' + p1.type + ', ' + p2.type);
    }

    const scope = context.getRoot().getObject().getMember('Compiler').getMember('current_scope');
    const {type, opcode, callback} = this.alternatives[p1.type][p2.type];

    if (scope.isUndefined()) {
      throw new Error('Instructions can only be used within function context');
    }

    scope.setMember('is_return_opcode', new BooleanObject(false));

    const code = new Code(scope.block.code);
    type.writer(scope, code, opcode, p1, p2, context);

    if (callback) {
      callback(scope, opcode, p1, p2, context);
    }
  }

  invokeRaw(context) {
    const obj = context.getObject();
    const p1 = new Parameter(context, obj.getMember('p1'));
    const p2 = new Parameter(context, obj.getMember('p2'));

    this.invoke(context, p1, p2);
  }

  build() {
    const macro = new MacroObject(this.name);
    const args = new ArgumentList();

    args.addArgument('p1', ArgumentList.TYPE_ARGUMENT, Nil);
    args.addArgument('p2', ArgumentList.TYPE_ARGUMENT, Nil);
    macro.setArguments(args);

    macro.setCallback((context, self) => {
      this.invokeRaw(context);
    })

    return macro;
  }
}
