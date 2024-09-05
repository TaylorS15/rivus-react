import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Basic data structures
export type ConversationMetadata<T = unknown> = {
  title: string;
  userId: string;
  conversationId: string;
  updatedAt: number;
  createdAt: number;
  metadata?: T;
};

export type ConversationData = {
  conversationId: string | null;
  userId: string;
  messages: {
    content: string;
    role: 'user' | 'assistant';
  }[];
};

// Configuration and options
export type RivusOptions = {
  /** Used as a bearer token sent with all requests, if specified. Parsed by reading the Authorization header on a request and stripping the `Bearer ` from the string. */
  authenticationToken?: string;
  /** Backend API url used by fetchers. Typically set by env variable.
   * @EXAMPLE fetch(`${apiUrl}/${endpoint}`, ...)
   */
  apiUrl: string;
  /** Set the backend endpoints each fetch function will hit when sending the corresponding requests.
   * @EXAMPLE fetch(`${apiUrl}/${endpoint}`, ...)
   */
  endpoints: {
    getPastConversations: string;
    getConversationData: string;
    postQuestion: string;
    deleteConversation: string;
  };
  /** Sets whether AI question responses will be read by stream or by full request body. */
  streamResponses: boolean;
  /** Used to provide a custom loading indicator when different parts of the UI are waiting on response. */
  loadingComponent: React.ReactNode;
  /** Used to provide a custom error notifier when different parts of the UI haven't received a proper response. */
  errorComponent: React.ReactNode;
  /** Displayed as a AI response message when there was an error in reading a response or failing to receive one. */
  chatErrorMessage: string;
};

export type ApiOptions = {
  url: string;
  endpoint: string;
  token?: string;
};

// Component props
export type RivusProviderProps = {
  children: React.ReactNode;
  options: RivusOptions;
};

export type ConversationProps = {
  className?: {
    container: string;
    userMessage: string;
    assistantMessage: string;
    noSelectedConversationText: string;
  };
};

export type ChatBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
  className?: string;
};

export type PastConversationProps = {
  className?: {
    container: string;
    pastConversationButton: string;
  };
  children?: React.ReactNode;
  iconColor?: string;
};

export type PastConversationButtonProps = {
  conversation: ConversationMetadata;
  iconColor?: string;
  refetch: () => void;
  className?: string;
};

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

export type SubmitButtonProps = {
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type UserInputProps = {
  children?: React.ReactNode;
  className?: string;
};
