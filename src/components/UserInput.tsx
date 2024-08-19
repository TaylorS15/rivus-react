import React from 'react';
import useRivusStore from '../store';
import { ConversationData } from '../types';
import { postQuestion } from '../api';
import { useRivusContext } from './RivusProvider';

interface InputContextType {
	question: string;
	setQuestion: React.Dispatch<React.SetStateAction<string>>;
	isResponseReceiving: boolean;
	handleQuestionSubmit: () => void;
}

const InputContext = React.createContext<InputContextType | null>(null);

export const useInputContext = () => {
	const context = React.useContext(InputContext);

	if (!context) {
		throw new Error('useInputContext must be used within a InputProvider');
	}

	return context;
};

export function InputProvider({ children }: { children: React.ReactNode }): JSX.Element {
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
		<InputContext.Provider
			value={{
				question,
				setQuestion,
				isResponseReceiving,
				handleQuestionSubmit,
			}}>
			{children}
		</InputContext.Provider>
	);
}

export default function UserInput({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<InputProvider>
			<div className={className}>{children}</div>
		</InputProvider>
	);
}
