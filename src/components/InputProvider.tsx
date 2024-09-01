import React from 'react';
import { ConversationData } from '../types';
import { postQuestion } from '../api';
import { useRivusContext } from './RivusProvider';
import useRivusStore from '../store';

export interface InputContextType {
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

	const selectedConversation = useRivusStore((state) => state.selectedConversation);
	const setSelectedConversation = useRivusStore(
		(state) => state.setSelectedConversation
	);
	const updateAiResponse = useRivusStore((state) => state.updateAiResponse);

	const { authenticationToken, endpoints, chatErrorMessage, apiUrl, streamResponses } =
		useRivusContext();

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
			{
				endpoint: endpoints.postQuestion,
				url: apiUrl,
				token: authenticationToken,
			},
			streamResponses,
			updateAiResponse,
			() => {
				setIsResponseReceiving(false);
			},
			() => {
				console.error('Error in posting question');
				updateAiResponse(chatErrorMessage);
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
