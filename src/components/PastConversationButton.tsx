import React, { useState } from 'react';
import { PastConversationButtonProps } from '../types';
import { Check, Trash2, X } from 'lucide-react';
import useRivusStore from '../store';
import { deleteConversation } from '../api';
import { useRivusContext } from './RivusProvider';
import clsx from 'clsx';

export default function PastConversationButton(props: PastConversationButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const setSelectedConversation = useRivusStore((state) => state.setSelectedConversation);
  const { authenticationToken, endpoints, apiUrl } = useRivusContext();

  return (
    <div
      className={clsx('past-conversation-button', props.className)}
      key={props.conversation.conversationId}
      onClick={() => {
        setSelectedConversation({
          conversationId: props.conversation.conversationId,
          userId: props.conversation.userId,
          messages: [],
        });
      }}>
      <p>{props.conversation.title}</p>

      {isDeleting && (
        <div className="is-deleting-buttons">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await deleteConversation(props.conversation.conversationId, {
                endpoint: endpoints.deleteConversation,
                url: apiUrl,
                token: authenticationToken,
              });
              props.refetch();
            }}>
            <Check size={18} color={props.iconColor ? props.iconColor : '#3f3f46'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleting(false);
            }}>
            <X size={18} color={props.iconColor ? props.iconColor : '#3f3f46'} />
          </button>
        </div>
      )}

      {!isDeleting && (
        <button
          className="trash-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleting(true);
          }}>
          <Trash2 size={18} color={props.iconColor ? props.iconColor : '#3f3f46'} />
        </button>
      )}
    </div>
  );
}
