import React from 'react';
import { InputProvider } from './InputProvider';
import { UserInputProps } from '../types';

export default function UserInput(props: UserInputProps) {
  return (
    <InputProvider>
      <div className={props.className}>{props.children}</div>
    </InputProvider>
  );
}
