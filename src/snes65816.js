export default `
; Extends the memory manager for some core functions
class CompilerMemoryManager
  macro allow(bank=nil, at=nil, range=nil, align=nil, located_at=nil)
    address_and = nil
    address_or  = nil

    unless bank.nil?
      address_and = $FFFF
      address_or  = bank << 16
    end

    unless at.nil?
      range = at..at
    end

    self.allow_range range, address_and, address_or, align, located_at
  end

  macro shadow(bank, range, shadow_bank, shadow_address)
    address_and = $FFFF
    address_or  = bank << 16

    modify_add = shadow_address - range.first
    modify_and = $FFFF
    modify_or  = shadow_bank << 16

    self.shadow_range range, address_and, address_or, modify_add, modify_and, modify_or
  end

  macro dp
    self.to_future_number.dp
  end

  macro long_address
    self.to_future_number.long_address
  end

  macro indirect(parameter=nil)
    self.to_future_number.indirect parameter
  end

  macro long_indirect(parameter=nil)
    self.to_future_number.long_indirect parameter
  end

  macro bank
    self.to_future_number.bank
  end
end

; Extends the compiler scope
class CompilerScope
  macro on_enter_function(function)
    if function.key? "register_size_A"
      self.set_size :A, function.register_size_A
    end

    if function.key? "register_size_XY"
      self.set_size :XY, function.register_size_XY
    end

    Compiler.current_scope.is_return_opcode = false
    Compiler.current_scope.current_function = function.name
  end

  macro on_leave_function(function)
    return if Compiler.current_scope.is_return_opcode

    RTS
  end

  macro size_hint_function(function)
    function.register_size_A = self.get_size(:A)
    function.register_size_XY = self.get_size(:XY)
  end

  macro on_call_function(function)
    self.size_hint_function function

    JSR function
  end

  macro set_size(name, size)
    name = "XY" if name == "X" || name == "Y"

    self["register_size_#{name}"] = size
  end

  macro get_size(name)
    name = "XY" if name == "X" || name == "Y"

    if self.key? "register_size_#{name}"
      self["register_size_#{name}"]
    else
      nil
    end
  end
end

module Snes65816

  opcodes = {}

  module OpcodeWriter

    macro im(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db value
    end

    macro im_16(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw value
    end

    macro im_a(opcode, value)
      Compiler.current_scope.db opcode
      case A.size
      when 8
        Compiler.current_scope.db value
      when 16
        Compiler.current_scope.dw value
      else
        raise "Unknown register size for A"
      end
    end

    macro im_x(opcode, value)
      Compiler.current_scope.db opcode
      case X.size
      when 8
        Compiler.current_scope.db value
      when 16
        Compiler.current_scope.dw value
      else
        raise "Unknown register size for X"
      end
    end

    macro im_y(opcode, value)
      Compiler.current_scope.db opcode
      case Y.size
      when 8
        Compiler.current_scope.db value
      when 16
        Compiler.current_scope.dw value
      else
        raise "Unknown register size for Y"
      end
    end

    macro addr(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw value
    end

    macro addr_pc(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw value
    end

    macro idpx
    end

    macro sr(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db value
    end

    macro dp(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db value
    end

    macro ildp(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db value
    end

    macro ildpy(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db value
    end

    macro long(opcode, value)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw value & $FFFF
      Compiler.current_scope.db value >> 16
    end

    macro relb(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db address - Compiler.current_scope.PC - 1
    end

    macro idpy(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db address
    end

    macro idp
    end

    macro isry
    end

    macro dpx(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db address
    end

    macro addry(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw address
    end

    macro addrx(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw address
    end

    macro longx(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw address & $FFFF
      Compiler.current_scope.db address >> 16
    end

    macro mv(opcode, left, right)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db right
      Compiler.current_scope.db left
    end

    macro relw
    end

    macro dpy(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.db address
    end

    macro iaddrx(opcode, address)
      Compiler.current_scope.db opcode
      Compiler.current_scope.dw address
    end

    macro impl(opcode)
      Compiler.current_scope.db opcode
    end

  end

  RAM = CompilerMemoryManager.new
  Compiler.register_dynamic_memory RAM

  (0..255).each do |bank|
    RAM.allow bank: bank, range: 0..$FFFF
  end

  ROM = CompilerMemoryManager.new
  Compiler.register_static_memory ROM

  ;; All common data registers can be extended using this class
  class Register
    macro initialize(name)
      self.name = name
    end

    macro set_size(size)
      Compiler.current_scope.set_size self.name, size
    end

    macro size
      Compiler.current_scope.get_size self.name
    end

    macro A?
      self.name == "A"
    end

    macro X?
      self.name == "X"
    end

    macro Y?
      self.name == "Y"
    end

    macro S?
      self.name == "S"
    end

    macro size_8?
      self.size == 8
    end

    macro size_16?
      self.size == 16
    end
  end

  macro normalize_opcode_number(number)
    return {type: :none, number: nil} if number.nil?
    return {type: :addr, number: number} if number.is_a? Number

    if number.is_a? TypedNumber
      typed_number = number
      type = number.type
      number = number.number

      case type
      when :constant
        return {type: :constant, number: number}

      when :direct_page
        return {type: :dp, number: number}

      when :long_address
        if number.is_a? TypedNumber
          inner = normalize_opcode_number(number)
          return {type: "long_#{inner.type}", number: inner.number}
        else
          return {type: :long, number: number}
        end

      when :indirect
        if typed_number.parameter.nil?
          return {type: :indirect, number: number}
        elsif typed_number.parameter.X?
          return {type: :indirect_x, number: number}
        elsif typed_number.parameter.S?
          return {type: :indirect_s, number: number}
        elsif typed_number.parameter.Y?
          return {type: :indirect_y, number: number}
        else
          raise "Unknown number type for opcode (INDIRECT)"
        end

      else
        raise "Unknown number type for opcode"
      end
    elsif number.is_function?
      return {type: :addr, number: number}
    elsif number.is_a? Register
      return {type: number.name, number: nil}
    else
      return {type: :addr, number: number.to_future_number}
    end
  end

  ;; Invokes an opcode
  macro call_opcode(name, left=nil, right=nil)
    left = normalize_opcode_number left
    right = normalize_opcode_number right

    call_type = nil

    call_arguments = [left.number, right.number]
    call_arguments = [left.number] if right.number.nil?
    call_arguments = [] if left.number.nil?

    type = "#{left.type}__#{right.type}"

    case type
    when :none__none
      call_type = [:impl]
    when :A__none
      call_type = [:impl]
    when :constant__none
      call_type = [:im, :im_a, :im_x, :im_y, :im_16]
    when :addr__none
      call_type = [:addr, :addr_pc, :relb]
    when :addr__X
      call_type = [:addrx]
    when :addr__S
      call_type = [:sr]
    when :addr__Y
      call_type = [:addry]
    when :addr__addr
      call_type = [:mv]
    when :long__none
      call_type = [:long]
    when :long_indirect__none
      call_type = [:ildp]
    when :long_indirect__Y
      call_type = [:ildpy]
    when :dp__none
      call_type = [:dp]
    when :dp__X
      call_type = [:dpx]
    when :dp__Y
      call_type = [:dpy]
    when :long__X
      call_type = [:longx]
    when :indirect_x__none
      call_type = [:iaddrx]
    when :indirect__Y
      call_type = [:idpy]
    else
      raise "Unexpected parameter type: #{type}"
    end

    has_valid_call = false
    call_type.each do |type|
      if Snes65816.opcodes[name].key? type
        Compiler.current_scope.is_return_opcode = false

        config = Snes65816.opcodes[name][type]
        config.block.call config.opcode, *call_arguments
        has_valid_call = true
      end
    end

    unless has_valid_call
      Compiler.print call_type
      raise "Opcode #{name} does not support parameter type"
    end
  end

  ;; Registers a new operator
  macro operator(opcode, name, type, &block)
    name = name.upcase
    type = type.downcase

    macro ::\\{name} *args
      call_opcode name, *args
    end

    block = MacroPointer.new(&OpcodeWriter[type]) if block.nil?

    Snes65816.opcodes[name] = {} unless Snes65816.opcodes.key? name
    Snes65816.opcodes[name][type] = {
      opcode: opcode,
      block: block
    }
  end

  ;; Configures the ROM
  macro configure_banks(banks, address, shadows_banks_from=nil, shadows_addresses_from=nil, located_at=nil)
    if shadows_banks_from.nil? && shadows_addresses_from.nil?

      banks.each do |bank|
        ROM.allow bank: bank, range: address, located_at: located_at
        located_at += address.size
      end

    else

      banks.each do |bank|
        ROM.shadow bank: bank, range: address, shadow_bank: shadows_banks_from, shadow_address: shadows_addresses_from
        shadows_banks_from += 1
      end

    end
  end

  ;; Assigns the memory location to the scope
  macro locate_at(bank=nil, address=nil, range=nil, align=nil)
    address_and = nil
    address_or  = nil

    unless bank.nil?
      address_and = $FFFF
      address_or  = bank << 16
    end

    unless address.nil?
      range = address..address
    end

    Compiler.current_scope.locate_at range, address_and, address_or, align
  end
end

;; Allocates a new RAM scope
macro scope(name, bank=nil, at=nil, length=nil, in=Snes65816::RAM, shared=false, align=nil, shadows_bank=nil, shadows_address=nil, dump_usage=false)
  address_range = nil

  if in.nil?
    ram = Snes65816::RAM.allocate
    ram.detach
  else
    ram = in.allocate
  end
  ram.set_is_shared shared
  ram.set_dump_usage dump_usage

  unless bank.nil? && at.nil? && align.nil?
    ram.allow bank: bank, at: at, align: align
  end

  unless length.nil?
    ram.set_item_size length
  end

  unless shadows_bank.nil? && shadows_address.nil?
    range_from = at
    range_to = at + length - 1
    shadows_address = range_from if shadows_address.nil?
    ram.shadow bank: bank, range: range_from..range_to, shadow_bank: shadows_bank, shadow_address: shadows_address
  end

  callee[name] = ram
  ram
end

;; Declares a variable
macro declare(name, as, in=nil, bank=nil, at=nil, length=nil, range=nil)
  if callee.is_a? Class
    callee.on_initialize_members do |in|
      self[name] = declare name, as, in, bank, at, length
    end
    callee.register_variable_offset name, as, length
    return
  end

  raise "Missing argument for declare: in" if in.nil?

  ram = in.allocate

  unless bank.nil? && at.nil? && range.nil?
    ram.allow bank: bank, at: at, range: range
  end

  ram.set_item_type as
  ram.set_num_items length

  callee[name] = ram
  ram
end

;; Object
class Object
  macro A?
    false
  end

  macro X?
    false
  end

  macro Y?
    false
  end

  macro S?
    false
  end
end

;; Future number
class FutureNumber

  ;; Mark this number to be DP
  macro dp
    TypedNumber.new self, :direct_page
  end

  ;; Marks this number to be a long address
  macro long_address
    TypedNumber.new self, :long_address
  end

  ;; Mark this number to be DP
  macro indirect(parameter=nil)
    num = TypedNumber.new self, :indirect
    num.parameter = parameter
    num
  end

  ;; Marks this number to be a long address
  macro long_indirect(parameter=nil)
    TypedNumber.new self.indirect(parameter), :long_address
  end

  ;; Returns the address of this number without the bank
  macro address
    self & $FFFF
  end

  ;; Returns the bank of this number
  macro bank
    (self >> 16) & $FF
  end

end

;; Extends the number class to support ASM core handling
class Number

  ;; Mark this number to be DP
  macro dp
    TypedNumber.new self, :direct_page
  end

  ;; Marks this number to be a long address
  macro long_address
    TypedNumber.new self, :long_address
  end

  ;; Mark this number to be DP
  macro indirect(parameter=nil)
    num = TypedNumber.new self, :indirect
    num.parameter = parameter
    num
  end

  ;; Marks this number to be a long address
  macro long_indirect(parameter=nil)
    TypedNumber.new self.indirect(parameter), :long_address
  end

  ;; Returns the address of this number without the bank
  macro address
    self & $FFFF
  end

  ;; Returns the bank of this number
  macro bank
    (self >> 16) & $FF
  end

end

;; The accumulator
A = Snes65816::Register.new "A"

;; The index register X
X = Snes65816::Register.new "X"

;; The index register Y
Y = Snes65816::Register.new "Y"

;; The stack register
S = Snes65816::Register.new "S"

;; Support dp(number) syntax
macro dp(number)
  number.dp
end

;; Indirect
macro indirect(number, parameter=nil)
  number.indirect(parameter)
end

;; Indirect
macro long_indirect(number, parameter=nil)
  number.long_indirect(parameter)
end

;; Sets the location of all functions
macro @locate_at(**kwargs)
  Snes65816.locate_at **kwargs

  yield
end

;; Tests registers
macro @requires(A=nil, XY=nil)
  unless A.nil?
    raise "Register A is required to be of size #{A}" unless ::A.size == A
  end

  unless XY.nil?
    raise "Register X/Y is required to be of size #{XY}" unless ::X.size == XY
  end

  yield
end

;; Sets the size of all functions
macro @register(A=nil, XY=nil)
  ::A.set_size A unless A.nil?
  ::X.set_size XY unless XY.nil?

  yield
end

;; Memory block declaration
macro memory_block(as=nil, name=nil, **kwargs)
  var = Compiler.define name do
    Snes65816.locate_at **kwargs

    yield Compiler.current_scope

    Compiler.current_scope.is_return_opcode = true
  end

  callee[as] = var.to_future_number unless as.nil?
  var.to_future_number
end

class __RoutineList
  macro initialize(a, xy)
    self.a = a
    self.xy = xy
  end

  macro add(addr)
    addr.register_size_A = self.a unless self.a.nil?
    addr.register_size_XY = self.xy unless self.xy.nil?
    Compiler.current_scope.dw addr
  end
end

;; Creates a list of routines
macro routine_list(as=nil, name=nil, A=nil, XY=nil, **kwargs)
  var = Compiler.define name do
    Snes65816.locate_at **kwargs
    yield __RoutineList.new(A, XY)
    Compiler.current_scope.is_return_opcode = true
  end

  callee[as] = var.to_future_number unless as.nil?
  var.to_future_number
end
`;
