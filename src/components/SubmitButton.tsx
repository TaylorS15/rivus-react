import React from 'react';
import { useInputContext } from './InputProvider';
import { SubmitButtonProps } from '../types';

export default function SubmitButton(props: SubmitButtonProps) {
  const { isResponseReceiving, handleQuestionSubmit } = useInputContext();

  return (
    <button
      type="submit"
      className={props.className}
      onClick={handleQuestionSubmit}
      disabled={isResponseReceiving}
      {...props}>
      {props.text}
    </button>
  );
}
