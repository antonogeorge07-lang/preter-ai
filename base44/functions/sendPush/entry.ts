const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import webpush from 'npm:web-push@3.6.7';

// 1. Initialize configuration at boot level (Fixes the scanning flag & increases speed)
const VAPID_MAIL = Deno.env.get('VAPID_EMAIL') || 'mailto:dev@vivaloca.app';
const VAPID_PUB = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIV = Deno.env.get('VAPID_PRIVATE_KEY');

// Verify that crucial credentials are physically present before serving requests
if (!VAPID_PUB || !VAPID_PRIV) {
  throw new Error('CRITICAL: Missing required VAPID key variables in the environment environment.');
}

// Set global configuration once
webpush.setVapidDetails(VAPID_MAIL, VAPID_PUB, VAPID_PRIV);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const isAuthed = await db.auth.isAuthenticated();
    if (!isAuthed) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { subscription, title, body, url, senderId, chatId, messageId } = await req.json();

    if (!subscription) {
      return Response.json({ error: 'Missing subscription' }, { status: 400 });
    }

    const payload = JSON.stringify({
      type: 'NEW_MESSAGE',
      title: title || 'VivaLoca',
      body: body || 'You have a new message',
      url: url || '/',
      senderId: String(senderId || ''),
      chatId: String(chatId || ''),
      messageId: String(messageId || ''),
    });

    // Fire the push notification smoothly
    await webpush.sendNotification(subscription, payload);
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
