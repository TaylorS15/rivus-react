import React from 'react';
import useSWR from 'swr';
import useRivusStore from '../store';
import { getPastConversations } from '../api';
import { useRivusContext } from './RivusProvider';
import { useEffect } from 'react';
import PastConversationButton from './PastConversationButton';
import { PastConversationProps } from '../types';

export default function PastConversations(props: PastConversationProps) {
	const pastConversations = useRivusStore((state) => state.pastConversations);
	const setPastConversations = useRivusStore((state) => state.setPastConversations);

	const { authenticationToken, endpoints, errorComponent, loadingComponent } =
		useRivusContext();

	const pastConversationsQuery = useSWR('past-conversations', async () => {
		return await getPastConversations(
			authenticationToken,
			endpoints.getPastConversations
		);
	});

	useEffect(() => {
		if (pastConversationsQuery.data) {
			setPastConversations(pastConversationsQuery.data);
		}
	}, [pastConversationsQuery.data]);

	if (pastConversationsQuery.error) {
		return <>{errorComponent}</>;
	}

	if (pastConversationsQuery.isLoading) {
		return <>{loadingComponent}</>;
	}

	return (
		<div className={props.className}>
			{pastConversations.map((conversation, index) => (
				<PastConversationButton
					key={index}
					iconColor={props.pastConversationButtonIconColor}
					className={props.pastConversationButtonClassName}
					conversation={conversation}
					refetch={pastConversationsQuery.mutate}
				/>
			))}
		</div>
	);
}
