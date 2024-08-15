import React from 'react';
import useRivusStore from '../store';
import { ConversationData } from '../types';
import { postQuestion } from '../api';
import { useRivusContext } from './RivusProvider';

export default function ChatInput({
	containerClassName,
	inputPlaceholder,
	inputClassName,
	buttonClassName,
}: {
	containerClassName?: string;
	inputPlaceholder?: string;
	inputClassName?: string;
	buttonClassName?: string;
}) {
	const [question, setQuestion] = React.useState('');
	const [isResponseReceiving, setIsResponseReceiving] = React.useState(false);

	const { selectedConversation, setSelectedConversation, updateAiResponse } =
		useRivusStore();
	const { authenticationToken, endpoints } = useRivusContext();

	async function handleQuestionSubmit() {
		setQuestion('');
		setIsResponseReceiving(true);

		const newQuestion = { content: question, role: 'user' as const };
		const updatedConversation: ConversationData = selectedConversation
			? {
					...selectedConversation,
					messages: [...selectedConversation.messages, newQuestion],
			  }
			: {
					conversationId: null,
					messages: [newQuestion],
			  };

		setSelectedConversation(updatedConversation);

		await postQuestion(
			updatedConversation,
			endpoints.postQuestion,
			authenticationToken,
			updateAiResponse,
			() => {
				setIsResponseReceiving(false);
			},
			() => {
				console.error('Error in posting question');
				setIsResponseReceiving(false);
			}
		);

		setIsResponseReceiving(false);
	}

	return (
		<div className={containerClassName}>
			<input
				type="text"
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
				placeholder={inputPlaceholder}
				className={inputClassName}
			/>
			<button
				onClick={handleQuestionSubmit}
				disabled={isResponseReceiving}
				className={buttonClassName}>
				Submit
			</button>
		</div>
	);
}
