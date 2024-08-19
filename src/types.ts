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
}

export interface RivusStore {
	pastConversations: ConversationMetadata[];
	selectedConversation: ConversationData | undefined;
	currentConversationId: string | undefined;
	setPastConversations: (pastConversations: ConversationMetadata[]) => void;
	setSelectedConversation: (conversation: ConversationData) => void;
	updateAiResponse: (chunk: string) => void;
	setCurrentConversationId: (conversationId: string) => void;
}
