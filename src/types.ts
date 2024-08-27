import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';

// Basic data structures
export type ConversationMetadata<OptionalMetadata = unknown> = {
	title: string;
	userId: string;
	conversationId: string;
	updatedAt: number;
	createdAt: number;
	metadata?: OptionalMetadata;
};

export type ConversationData = {
	conversationId: string | null;
	messages: {
		content: string;
		role: 'user' | 'assistant';
	}[];
};

// Configuration and options
export type RivusOptions = {
	authenticationToken?: string;
	endpoints: {
		getPastConversations: string;
		postQuestion: string;
		deleteConversation: string;
		getConversationData: string;
	};
	loadingComponent: React.ReactNode;
	errorComponent: React.ReactNode;
	chatErrorMessage: string;
};

// Component props
export type RivusProviderProps = {
	children: React.ReactNode;
	options: RivusOptions;
};

export type ConversationProps = {
	className?: {
		container: string;
		userMessage: string;
		assistantMessage: string;
	};
};

export type ChatBubbleProps = {
	role: 'user' | 'assistant';
	content: string;
	className?: string;
};

export type PastConversationProps = {
	className?: {
		container: string;
		pastConversationButton: string;
	};
	children?: React.ReactNode;
	iconColor?: string;
};

export type PastConversationButtonProps = {
	conversation: ConversationMetadata;
	iconColor?: string;
	refetch: () => void;
	className?: string;
};

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

export type SubmitButtonProps = {
	text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type UserInputProps = {
	children?: React.ReactNode;
	className?: string;
};
