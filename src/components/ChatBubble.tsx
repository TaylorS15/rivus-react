import React from 'react';
import { useEffect, useState } from 'react';

export default function ChatBubble({
	role,
	content,
}: {
	role: 'user' | 'assistant';
	content: string;
}) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsLoaded(true);
		}, 100);
	}, []);

	return (
		<div
			className={`${role === 'user' ? 'ml-auto' : 'mr-auto bg-green-100/70'} ${
				isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
			} min-w-sm mb-4 h-auto w-fit max-w-xl select-text overflow-x-clip whitespace-pre-wrap break-words rounded-sm p-3 font-medium transition-all duration-300`}>
			<p className="text-base">{content}</p>
		</div>
	);
}
