import { supabase } from "./supabase";

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  content: string;
  is_user: boolean;
  model_id?: string;
  timestamp: string;
  created_at: string;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: Message[];
}

// Chat Sessions
export const createChatSession = async (
  title: string
): Promise<ChatSession> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user.id,
      title,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getChatSessionWithMessages = async (
  sessionId: string
): Promise<ChatSessionWithMessages | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("chat_sessions")
    .select(
      `
      *,
      messages (*)
    `
    )
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No rows returned
    throw error;
  }

  return {
    ...data,
    messages: data.messages.sort(
      (a: Message, b: Message) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ),
  };
};

export const updateChatSessionTitle = async (
  sessionId: string,
  title: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) throw error;
};

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) throw error;
};

// Messages
export const addMessage = async (
  sessionId: string,
  content: string,
  isUser: boolean,
  modelId?: string
): Promise<Message> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      session_id: sessionId,
      content,
      is_user: isUser,
      model_id: modelId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addMultipleMessages = async (
  sessionId: string,
  messages: Array<{
    content: string;
    isUser: boolean;
    modelId?: string;
  }>
): Promise<Message[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const messageData = messages.map((msg) => ({
    session_id: sessionId,
    content: msg.content,
    is_user: msg.isUser,
    model_id: msg.modelId,
  }));

  const { data, error } = await supabase
    .from("messages")
    .insert(messageData)
    .select();

  if (error) throw error;
  return data || [];
};

export const getMessages = async (sessionId: string): Promise<Message[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data || [];
};
