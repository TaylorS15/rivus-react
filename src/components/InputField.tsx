import React from 'react';
import { useInputContext } from './InputProvider';
import { InputFieldProps } from '../types';

export default function InputField(props: InputFieldProps) {
  const { question, setQuestion, isResponseReceiving } = useInputContext();

  return (
    <input
      type="text"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      disabled={isResponseReceiving}
      className={props.className}
      placeholder={props.placeholder}
      {...props}
    />
  );
}
