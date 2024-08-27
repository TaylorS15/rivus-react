import { ConversationData, ConversationMetadata } from './types';

const apiUrl = process.env.NEXT_PUBLIC_RIVUS_API_URL ?? process.env.RIVUS_API_URL;
if (!apiUrl) {
	throw new Error('API URL is not defined');
}

export async function getConversationData(
	conversationId: string,
	endpoint: string,
	token: string | undefined
): Promise<ConversationData> {
	if (!conversationId) {
		throw new Error('Conversation ID is required');
	}

	const url = `${apiUrl}/${endpoint}/?conversationId=${conversationId}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			throw new Error('Failed to fetch conversation data');
		}

		const data: unknown = await response.json();

		const isConversationData = (data: unknown): data is ConversationData => {
			return (
				typeof data === 'object' &&
				data !== null &&
				'conversationId' in data &&
				typeof data.conversationId === 'string' &&
				'messages' in data &&
				Array.isArray((data as ConversationData).messages)
			);
		};

		if (!isConversationData(data)) {
			throw new Error('Invalid response format');
		}

		return data;
	} catch (error) {
		throw error;
	}
}

export async function getPastConversations(
	token: string | undefined,
	endpoint: string
): Promise<ConversationMetadata[]> {
	const url = `${apiUrl}/${endpoint}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(url.toString(), {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			throw new Error('Failed to fetch past conversations');
		}

		const data: unknown = await response.json();

		const isConversationMetadata = (
			data: unknown
		): data is ConversationMetadata[] => {
			return (
				Array.isArray(data) &&
				data.every((conversation) => {
					return (
						typeof conversation === 'object' &&
						conversation !== null &&
						'title' in conversation &&
						typeof conversation.title === 'string' &&
						'userId' in conversation &&
						typeof conversation.userId === 'string' &&
						'conversationId' in conversation &&
						typeof conversation.conversationId === 'string' &&
						'updatedAt' in conversation &&
						typeof conversation.updatedAt === 'number' &&
						'createdAt' in conversation &&
						typeof conversation.createdAt === 'number'
					);
				})
			);
		};

		if (!isConversationMetadata(data)) {
			throw new Error('Invalid response format');
		}

		return data;
	} catch (error) {
		throw error;
	}
}

export async function deleteConversation(
	conversationId: string,
	endpoint: string,
	token: string | undefined
) {
	let url = `${apiUrl}/${endpoint}?conversationId=${conversationId}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(url.toString(), {
			method: 'DELETE',
			headers,
		});

		if (!response.ok) {
			throw new Error('Failed to delete conversation');
		}
	} catch (error) {
		throw error;
	}
}

export async function postQuestion(
	conversation: ConversationData,
	endpoint: string,
	token: string | undefined,
	onChunk: (chunk: string) => void,
	onDone: () => void,
	onError: (error: Error) => void
) {
	const url = `${apiUrl}/${endpoint}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(conversation),
		});

		if (!response.ok) {
			throw new Error('Failed to post question');
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('ReadableStream not supported');
		}

		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			buffer += decoder.decode(value, { stream: true });

			const lines = buffer.split('\n\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6);
					if (data === '[DONE]') {
						onDone();
						return;
					}
					onChunk(data);
				}
			}
		}

		onDone();
	} catch (error) {
		onError(error instanceof Error ? error : new Error('An unknown error occurred'));
	}
}
