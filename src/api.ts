import { ApiOptions, ConversationData, ConversationMetadata } from './types';

export async function getConversationData(
	conversationId: string,
	apiOptions: ApiOptions
): Promise<ConversationData> {
	if (!conversationId) {
		throw new Error('Conversation ID is required');
	}

	const url = `${apiOptions.url}/${apiOptions.endpoint}/?conversationId=${conversationId}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (apiOptions.token) {
		headers['Authorization'] = `Bearer ${apiOptions.token}`;
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
	apiOptions: ApiOptions
): Promise<ConversationMetadata[]> {
	const url = `${apiOptions.url}/${apiOptions.endpoint}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (apiOptions.token) {
		headers['Authorization'] = `Bearer ${apiOptions.token}`;
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

export async function deleteConversation(conversationId: string, apiOptions: ApiOptions) {
	let url = `${apiOptions.url}/${apiOptions.endpoint}?conversationId=${conversationId}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (apiOptions.token) {
		headers['Authorization'] = `Bearer ${apiOptions.token}`;
	}

	try {
		const response = await fetch(url, {
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
	apiOptions: ApiOptions,
	stream: boolean,
	onChunk: (chunk: string) => void,
	onDone: () => void,
	onError: (error: Error) => void
) {
	const url = `${apiOptions.url}/${apiOptions.endpoint}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (apiOptions.token) {
		headers['Authorization'] = `Bearer ${apiOptions.token}`;
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

		if (!stream) {
			onChunk(await response.text());
			return;
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

			buffer = lines.pop() || '';
		}

		onDone();
	} catch (error) {
		onError(error instanceof Error ? error : new Error('An unknown error occurred'));
	}
}
