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

	const { authenticationToken, endpoints, errorComponent, loadingComponent, apiUrl } =
		useRivusContext();

	const pastConversationsQuery = useSWR('past-conversations', async () => {
		return await getPastConversations({
			endpoint: endpoints.getPastConversations,
			url: apiUrl,
			token: authenticationToken,
		});
	});

	useEffect(() => {
		if (pastConversationsQuery.data) {
			setPastConversations(pastConversationsQuery.data);
		}
	}, [pastConversationsQuery.data]);

	if (pastConversationsQuery.error) {
		return <div className={props.className?.container}>{errorComponent}</div>;
	}

	if (pastConversationsQuery.isLoading) {
		return <div className={props.className?.container}>{loadingComponent}</div>;
	}

	return (
		<div className={props.className?.container}>
			{pastConversations.map((conversation, index) => (
				<PastConversationButton
					key={index}
					iconColor={props.iconColor}
					className={props.className?.pastConversationButton}
					conversation={conversation}
					refetch={pastConversationsQuery.mutate}
				/>
			))}
		</div>
	);
}
