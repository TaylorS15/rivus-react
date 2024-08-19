import React from 'react';
import { useInputContext } from './UserInput';

export default function InputField({
	className,
	placeholder,
}: {
	className?: string;
	placeholder?: string;
}) {
	const { question, setQuestion, isResponseReceiving } = useInputContext();

	return (
		<input
			type="text"
			value={question}
			onChange={(e) => setQuestion(e.target.value)}
			placeholder={placeholder}
			disabled={isResponseReceiving}
			className={className}
		/>
	);
}
