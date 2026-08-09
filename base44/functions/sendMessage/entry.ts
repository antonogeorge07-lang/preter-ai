const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await db.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { msgPayload, recipientId } = body;

    if (!msgPayload || !recipientId) {
      return Response.json({ error: 'Missing msgPayload or recipientId' }, { status: 400 });
    }

    // Fetch recipient's profile to check their block list
    const recipients = await db.asServiceRole.entities.User.filter({ id: recipientId }, '-created_date', 1);
    const recipient = recipients[0];

    if (recipient) {
      const recipientBlockList = Array.isArray(recipient.blocked_user_ids)
        ? recipient.blocked_user_ids
        : [];
      if (recipientBlockList.includes(user.id)) {
        return Response.json({ error: 'blocked' }, { status: 403 });
      }
    }

    // Safe to persist the message
    const newMsg = await db.asServiceRole.entities.Message.create(msgPayload);

    // Fire push notification to recipient (best-effort, don't fail the request)
    try {
      const recipientFull = recipient || (await db.asServiceRole.entities.User.filter({ id: recipientId }, '-created_date', 1))[0];
      const subscription = recipientFull?.push_subscription
        ? (typeof recipientFull.push_subscription === 'string' ? JSON.parse(recipientFull.push_subscription) : recipientFull.push_subscription)
        : null;
      if (subscription) {
        await db.asServiceRole.functions.invoke('sendPush', {
          subscription,
          title: msgPayload.sender_name || 'Preter',
          body: msgPayload.content || 'New message',
          url: `/chat/${msgPayload.conversation_id}`,
          chatId: msgPayload.conversation_id,
          messageId: newMsg.id,
          senderId: user.id,
        });
      }
    } catch (_) { /* push failure must not block message delivery */ }

    return Response.json({ message: newMsg });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});