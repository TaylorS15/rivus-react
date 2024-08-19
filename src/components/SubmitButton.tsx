import React from 'react';
import { useInputContext } from './UserInput';

export default function SubmitButton({
	className,
	text,
}: {
	className?: string;
	text: string;
}) {
	const { isResponseReceiving, handleQuestionSubmit } = useInputContext();

	return (
		<button
			type="submit"
			className={className}
			onClick={handleQuestionSubmit}
			disabled={isResponseReceiving}>
			{text}
		</button>
	);
}
