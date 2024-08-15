import React, { useState } from 'react';
import { ConversationMetadata } from '../types';
import { Check, Trash2, X } from 'lucide-react';
import useRivusStore from '../store';
import useSWR from 'swr';
import { getPastConversations, deleteConversation } from '../api';
import { useRivusContext } from './RivusProvider';

export default function PastConversationButton({
	conversation,
}: {
	conversation: ConversationMetadata;
}) {
	const [isDeleting, setIsDeleting] = useState(false);

	const { setSelectedConversation } = useRivusStore();
	const { authenticationToken, loadingComponent, errorComponent, endpoints } =
		useRivusContext();

	const pastConversationsQuery = useSWR<ConversationMetadata[]>(
		['past-conversations'],
		async () =>
			await getPastConversations(
				authenticationToken,
				endpoints.getPastConversations
			)
	);

	if (pastConversationsQuery.isLoading) {
		return <>{loadingComponent}</>;
	}

	if (pastConversationsQuery.error) {
		return <>{errorComponent}</>;
	}

	return (
		<div
			className="flex h-10 min-w-24 max-w-64 cursor-pointer rounded-md border border-emerald-100 bg-emerald-50 transition hover:border-emerald-200 hover:bg-emerald-100"
			key={conversation.conversationId}
			onClick={() => {
				setSelectedConversation({
					conversationId: conversation.conversationId,
					messages: [],
				});
			}}>
			<p className="truncate px-2 pt-2 text-zinc-700">{conversation.title}</p>

			{isDeleting && (
				<div className="ml-auto mr-1 flex gap-1">
					<button
						onClick={async (e) => {
							e.stopPropagation();
							await deleteConversation(
								conversation.conversationId,
								endpoints.deleteConversation,
								authenticationToken
							);
							pastConversationsQuery.mutate();
						}}>
						<Check size={18} color="#3f3f46" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsDeleting(false);
						}}>
						<X size={18} color="#3f3f46" />
					</button>
				</div>
			)}

			{!isDeleting && (
				<button
					className="ml-auto mr-1"
					onClick={(e) => {
						e.stopPropagation();
						setIsDeleting(true);
					}}>
					<Trash2 size={18} color="#3f3f46" />
				</button>
			)}
		</div>
	);
}
