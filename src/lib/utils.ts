export type WrappedString = {
  value: string;
  prepend(prefix: string): WrappedString;
  append(suffix: string): WrappedString;
  [Symbol.toPrimitive](): string;
  toString(): string;
};

export const wrap = (str: string): WrappedString => ({
  value: str,
  prepend(prefix: string): WrappedString {
    return this.value ? wrap(prefix + this.value) : this;
  },
  append(suffix: string): WrappedString {
    return this.value ? wrap(this.value + suffix) : this;
  },
  [Symbol.toPrimitive]() {
    return this.value;
  },
  toString() {
    return this.value;
  },
});
