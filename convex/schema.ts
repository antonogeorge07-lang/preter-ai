import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    participant_ids: v.array(v.string()),
    participant_names: v.optional(v.array(v.string())),
    participant_languages: v.optional(v.string()),
    participant_name: v.optional(v.string()),
    participant_avatar: v.optional(v.string()),
    preferred_language: v.optional(v.string()),
    invite_code: v.optional(v.string()),
    invite_open: v.optional(v.boolean()),
    last_message_preview: v.optional(v.string()),
    last_message_time: v.optional(v.string()),
    unread_counts: v.optional(v.string()),
    is_group: v.optional(v.boolean()),
  }).index("by_invite_code", ["invite_code"]),

  messages: defineTable({
    conversation_id: v.string(),
    sender_id: v.string(),
    sender_name: v.optional(v.string()),
    content: v.optional(v.string()),
    translated_content: v.optional(v.string()),
    original_language: v.optional(v.string()),
    target_language: v.optional(v.string()),
    type: v.optional(v.string()),
    audio_url: v.optional(v.string()),
    image_url: v.optional(v.string()),
  }).index("by_conversation", ["conversation_id"]),
});
