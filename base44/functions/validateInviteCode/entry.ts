const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code } = await req.json();

    if (!code) return Response.json({ error: 'Missing invite code' }, { status: 400 });

    const results = await db.asServiceRole.entities.Conversation.filter({ invite_code: code });
    if (!results || results.length === 0) {
      return Response.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    const conv = results[0];
    const user = await db.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const ids = conv.participant_ids || [];
    if (ids.includes(user.id)) {
      return Response.json({ already_member: true, conversation_id: conv.id });
    }

    const updatedIds = [...ids, user.id];
    const updatedNames = [...(conv.participant_names || [conv.participant_name || '']), user.full_name || user.email];
    let langs = {};
    try { langs = JSON.parse(conv.participant_languages || '{}'); } catch {}
    langs[user.id] = user.default_language || 'en';

    await db.asServiceRole.entities.Conversation.update(conv.id, {
      participant_ids: updatedIds,
      participant_names: updatedNames,
      participant_languages: JSON.stringify(langs),
    });

    return Response.json({ success: true, conversation_id: conv.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});