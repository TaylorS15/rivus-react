// Basic data structures
export interface ConversationMetadata<OptionalMetadata = unknown> {
	title: string;
	userId: string;
	conversationId: string;
	lastUpdated: number;
	created: number;
	metadata?: OptionalMetadata;
}

export interface ConversationData {
	conversationId: string | null;
	messages: {
		content: string;
		role: 'user' | 'assistant';
	}[];
}

// Configuration and options
export interface RivusOptions {
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
	enableChatBubbleAnimations: boolean;
}

// Component props
export interface ChatBubbleProps {
	role: 'user' | 'assistant';
	content: string;
	showAnimations: boolean;
	className?: string;
}

export interface ConversationProps {
	className?: string;
	chatBubbleClassName?: string;
}

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface PastConversationButtonProps {
	conversation: ConversationMetadata;
	iconColor: string;
	refetch: () => void;
	className?: string;
}

export interface RivusProviderProps {
	children: React.ReactNode;
	options: RivusOptions;
}

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
}

export interface UserInputProps {
	children?: React.ReactNode;
	className?: string;
}

export interface PastConversationProps {
	className?: string;
	children?: React.ReactNode;
	pastConversationButtonIconColor: string;
	pastConversationButtonClassName: string;
}
