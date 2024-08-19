import React from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChatBubbleProps } from '../types';

export default function ChatBubble(props: ChatBubbleProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsLoaded(true);
		}, 100);
	}, []);

	return (
		<div
			className={clsx('chat-bubble', props.className)}
			data-role={props.role}
			data-loaded={props.showAnimations ? isLoaded : null}>
			<p>{props.content}</p>
		</div>
	);
}
