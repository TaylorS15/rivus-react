import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useRivusContext } from './RivusProvider';
import useRivusStore from '../store';
import { getConversationData } from '../api';
import ChatBubble from './ChatBubble';
import type { ConversationData, ConversationProps } from '../types';

export default function Conversation(props: ConversationProps) {
  const selectedConversation = useRivusStore((state) => state.selectedConversation);
  const setSelectedConversation = useRivusStore((state) => state.setSelectedConversation);

  const { endpoints, authenticationToken, loadingComponent, errorComponent, apiUrl } =
    useRivusContext();

  const conversationDataQuery = useSWR<ConversationData | undefined>(
    selectedConversation?.conversationId
      ? ['conversation-data', selectedConversation.conversationId]
      : null,
    async () => {
      if (!selectedConversation || !selectedConversation.conversationId) {
        return undefined;
      }

      return await getConversationData(selectedConversation.conversationId, {
        url: apiUrl,
        endpoint: endpoints.getConversationData,
        token: authenticationToken,
      });
    }
  );

  useEffect(() => {
    if (conversationDataQuery.data) {
      setSelectedConversation(conversationDataQuery.data);
    }
  }, [conversationDataQuery.data, selectedConversation]);

  if (conversationDataQuery.isLoading) {
    return <div className={props.className?.container}>{loadingComponent}</div>;
  }

  if (conversationDataQuery.error) {
    return <div className={props.className?.container}>{errorComponent}</div>;
  }

  return (
    <div className={props.className?.container}>
      {!selectedConversation ? (
        <p className={props.className?.noSelectedConversationText}>
          No conversation selected
        </p>
      ) : (
        <>
          {selectedConversation.messages.map((chat, index) => (
            <ChatBubble
              key={index}
              content={chat.content}
              role={chat.role}
              className={
                chat.role === 'user'
                  ? props.className?.userMessage
                  : props.className?.assistantMessage
              }
            />
          ))}
        </>
      )}
    </div>
  );
}
