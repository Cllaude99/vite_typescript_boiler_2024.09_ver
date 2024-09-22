import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

export interface InputType {
  readonly name: string;
}

const Input = (
  { name, ...restProps }: InputType & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <input
      ref={ref}
      name={name}
      className="w-full transition bg-transparent border-none rounded-md min-h-10 focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-blue-400 placeholder:text-neutral-400"
      {...restProps}
    />
  );
};

export default forwardRef(Input);
