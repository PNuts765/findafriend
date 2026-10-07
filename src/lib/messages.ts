import { canSendMessage } from './limits';
import { sendMessage as sendDatabaseMessage } from './data';

export async function sendMessageWithLimit(
  conversationId: string,
  body: string
) {
  const cleanBody = body.trim();

  if (!cleanBody) {
    return {
      message: null,
      error: new Error('Message cannot be empty.')
    };
  }

  const limit = await canSendMessage();

  if (!limit.allowed) {
    return {
      message: null,
      error: new Error(
        'You have used all 10 of your free outgoing messages for this week. You can send messages again when your weekly allowance resets, or upgrade to Pro for unlimited messaging.'
      )
    };
  }

  return sendDatabaseMessage(
    conversationId,
    cleanBody
  );
}