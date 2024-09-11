import { create } from 'zustand';
import { ConversationData, ConversationMetadata } from './types';

interface RivusStore {
  pastConversations: ConversationMetadata[];
  selectedConversation: ConversationData | undefined;
  currentConversationId: string | undefined;
  setPastConversations: (pastConversations: ConversationMetadata[]) => void;
  setSelectedConversation: (conversation: ConversationData) => void;
  updateAiResponse: (chunk: string) => void;
  setCurrentConversationId: (conversationId: string) => void;
}

const useRivusStore = create<RivusStore>()((set) => ({
  pastConversations: [],
  selectedConversation: undefined,
  currentConversationId: undefined,
  setPastConversations: (pastConversations) => set({ pastConversations }),
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  updateAiResponse: (chunk) =>
    set((state) => {
      if (state.selectedConversation) {
        const lastChatIndex = state.selectedConversation.messages.length - 1;

        if (state.selectedConversation.messages[lastChatIndex].role === 'assistant') {
          state.selectedConversation.messages[lastChatIndex].content += chunk;
        } else {
          state.selectedConversation.messages.push({
            role: 'assistant',
            content: chunk,
          });
        }
      }

      return { selectedConversation: state.selectedConversation };
    }),
  setCurrentConversationId: (currentConversationId) => set({ currentConversationId }),
}));

export default useRivusStore;
