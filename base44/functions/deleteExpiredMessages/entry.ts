const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date().toISOString();

    const expired = await db.asServiceRole.entities.Message.filter({
      expires_at: { $lte: now },
      deleted: false
    }, 'created_date', 200);

    if (expired.length === 0) {
      return Response.json({ deleted: 0 });
    }

    await Promise.all(expired.map(m =>
      db.asServiceRole.entities.Message.update(m.id, { deleted: true })
    ));

    return Response.json({ deleted: expired.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});