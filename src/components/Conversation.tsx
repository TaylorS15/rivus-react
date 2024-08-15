import React from 'react';
import { ConversationData } from '../types';
import { useEffect } from 'react';
import useSWR from 'swr';
import ChatBubble from './ChatBubble';
import useRivusStore from '../store';
import { getConversationData } from '../api';
import { useRivusContext } from './RivusProvider';

export default function Conversation() {
	const { selectedConversation, setSelectedConversation } = useRivusStore();
	const { endpoints, authenticationToken, loadingComponent, errorComponent } =
		useRivusContext();

	if (!selectedConversation) {
		return null;
	}

	const conversationDataQuery = useSWR<ConversationData | undefined>(
		['conversation-data', selectedConversation.conversationId],
		async () => {
			if (!selectedConversation.conversationId) {
				return undefined;
			}

			return await getConversationData(
				selectedConversation.conversationId,
				endpoints.getConversationData,
				authenticationToken
			);
		}
	);

	useEffect(() => {
		if (conversationDataQuery.data) {
			setSelectedConversation(conversationDataQuery.data);
		}
	}, [conversationDataQuery.data]);

	if (conversationDataQuery.isLoading) {
		return <>{loadingComponent}</>;
	}

	if (conversationDataQuery.error) {
		return <>{errorComponent}</>;
	}

	return (
		<>
			{selectedConversation.messages.map((chat, index) => (
				<ChatBubble key={index} content={chat.content} role={chat.role} />
			))}
		</>
	);
}
