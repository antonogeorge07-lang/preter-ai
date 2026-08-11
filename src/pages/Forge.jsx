import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { detectAndTranslate } from '@/lib/translation';
import ConversationList from '@/components/chat/ConversationList';
import ChatView from '@/components/chat/ChatView';
import MorningSummary from '@/components/chat/MorningSummary';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import UserProfile from '@/components/chat/UserProfile';
import VideoFilePicker from '@/components/chat/VideoFilePicker';
import BottomTabBar from '@/components/chat/BottomTabBar';
import VoiceCallModal from '@/components/chat/VoiceCallModal';
import IncomingCallBanner from '@/components/chat/IncomingCallBanner';
import ForgeGuideNode from '@/components/chat/ForgeGuideNode';
import PWAInstallBanner from '@/components/chat/PWAInstallBanner';
import BlockReportModal from '@/components/chat/BlockReportModal';
import GlobalSearch from '@/components/chat/GlobalSearch';
import ContactDiscovery from '@/components/chat/ContactDiscovery';
import { registerPushNotifications, notifyIfHidden } from '@/lib/pushNotifications';
import OnboardingModal from '@/components/chat/OnboardingModal';
import { enqueue, flushQueue } from '@/lib/offlineQueue';

export default function Forge({ currentUser }) {
  const { chatId } = useParams();
  const navigate = useNavigate();

  // Reactive Convex state
  const rawConversations = useQuery(
    api.conversations.getUserConversations,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );
  const rawMessages = useQuery(
    api.messages.getConversationMessages,
    chatId ? { conversationId: chatId } : "skip"
  );

  const sendMessageMutation = useMutation(api.messages.sendMessage);
  const createConvMutation = useMutation(api.conversations.createConversation);
  const updateConvStateMutation = useMutation(api.conversations.updateConversationState);
  const setTypingMutation = useMutation(api.conversations.setTypingStatus);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceRecorderOpen, setVoiceRecorderOpen] = useState(false);
  const [videoRecorderOpen, setVideoRecorderOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callType, setCallType] = useState('audio');
  const [incomingCallSession, setIncomingCallSession] = useState(null);
  const [callConversation, setCallConversation] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [blockReportTarget, setBlockReportTarget] = useState(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [contactDiscoveryOpen, setContactDiscoveryOpen] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(() => !!localStorage.getItem('vl_onboarded'));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const typingTimerRef = useRef(null);

  useEffect(() => {
    if (currentUser?._id) registerPushNotifications();
  }, [currentUser?._id]);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      flushQueue(async (item) => {
        await sendMessageMutation(item);
      });
    };
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [sendMessageMutation]);

  const conversations = rawConversations || [];
  const messages = rawMessages || [];

  const activeConversation = chatId ? conversations.find(c => c._id === chatId) || null : null;
  const blockedUserIds = Array.isArray(currentUser?.blockedUserIds) ? currentUser.blockedUserIds : [];
  
  const markedMessages = messages
    .filter(msg => !blockedUserIds.includes(msg.senderId))
    .map(msg => ({
      ...msg,
      sender: (msg.isGuide || msg.senderId !== currentUser?._id) ? 'them' : 'me'
    }));

  const getMyLang = useCallback((conv) => {
    if (!conv || !currentUser) return conv?.preferredLanguage || 'en';
    try {
      const langs = JSON.parse(conv.participantLanguages || '{}');
      return langs[currentUser._id] || conv.preferredLanguage || 'en';
    } catch {
      return conv.preferredLanguage || 'en';
    }
  }, [currentUser]);

  const selectConversation = useCallback((conv) => {
    if (conv) navigate(`/chat/${conv._id}`);
    else navigate('/');
    setSidebarOpen(false);
  }, [navigate]);

  const sendTyping = useCallback(async (isTyping) => {
    if (!activeConversation || !currentUser?._id) return;
    try {
      await setTypingMutation({
        conversationId: activeConversation._id,
        userId: currentUser._id,
        isTyping,
      });
    } catch {}
  }, [activeConversation, currentUser?._id, setTypingMutation]);

  const handleTyping = useCallback(() => {
    sendTyping(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => sendTyping(false), 3000);
  }, [sendTyping]);

  const sendMessage = useCallback(async (text, expiresAt) => {
    if (!activeConversation || !currentUser?._id || isProcessing) return;
    
    setIsProcessing(true);
    sendTyping(false);
    clearTimeout(typingTimerRef.current);

    const recipientLang = getMyLang(activeConversation);
    const msgPayload = {
      conversationId: activeConversation._id,
      senderId: currentUser._id,
      senderName: currentUser.fullName || currentUser.email,
      content: text,
      type: 'text',
      ...(expiresAt && { expiresAt }),
      ...(replyTo && {
        replyToId: replyTo.id,
        replyToContent: replyTo.content,
        replyToSender: replyTo.sender_name,
      }),
    };

    if (replyTo) setReplyTo(null);

    if (!navigator.onLine) {
      enqueue(msgPayload);
      setIsProcessing(false);
      return;
    }

    try {
      const { translatedText, detectedLang } = await detectAndTranslate(text, recipientLang);
      await sendMessageMutation({
        ...msgPayload,
        translatedContent: translatedText,
        originalLanguage: detectedLang,
        targetLanguage: recipientLang,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [activeConversation, currentUser, isProcessing, replyTo, getMyLang, sendTyping, sendMessageMutation]);

  const handlePinConversation = useCallback(async (conv) => {
    await updateConvStateMutation({ conversationId: conv._id, pinned: !conv.pinned });
  }, [updateConvStateMutation]);

  const handleArchiveConversation = useCallback(async (conv) => {
    await updateConvStateMutation({ conversationId: conv._id, archived: !conv.archived });
    if (chatId === conv._id) navigate('/');
  }, [chatId, navigate, updateConvStateMutation]);

  const handleMuteConversation = useCallback(async (conv) => {
    await updateConvStateMutation({ conversationId: conv._id, muted: !conv.muted });
  }, [updateConvStateMutation]);

  const myLang = getMyLang(activeConversation);

  return (
    <div className="w-screen flex relative overflow-hidden" style={{ background: 'var(--background)', height: '100svh', minHeight: '-webkit-fill-available' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden dot-grid opacity-60" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="theme-orb theme-orb-1" /><div className="theme-orb theme-orb-2" /><div className="theme-orb theme-orb-3" />
      </div>

      <div className="flex-shrink-0">
        <ConversationList
          conversations={conversations}
          activeId={chatId}
          onSelect={selectConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onPin={handlePinConversation}
          onArchive={handleArchiveConversation}
          onMuteConversation={handleMuteConversation}
          onBlockReport={(conv) => setBlockReportTarget(conv)}
          onProfileClick={() => setProfileOpen(true)}
          onSearchOpen={() => setGlobalSearchOpen(true)}
          onFindPeople={() => setContactDiscoveryOpen(true)}
          currentUser={currentUser}
        />
      </div>

      <div className="flex flex-1 min-w-0 flex-col relative z-10 overflow-hidden pb-[calc(60px+env(safe-area-inset-bottom))] lg:pb-0">
        {activeConversation ? (
          <ChatView
            conversation={activeConversation}
            messages={markedMessages}
            currentUser={currentUser}
            myLang={myLang}
            onSendMessage={sendMessage}
            onTyping={handleTyping}
            onStartRecording={() => setVoiceRecorderOpen(true)}
            onStartVideo={() => setVideoRecorderOpen(true)}
            isProcessing={isProcessing}
            onBack={() => navigate('/')}
            onStartCall={(type) => {
              setCallType(type);
              setIncomingCallSession(null);
              setCallConversation(activeConversation);
              setCallOpen(true);
            }}
            replyTo={replyTo}
            onSetReplyTo={setReplyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        ) : (
          <MorningSummary
            conversations={conversations}
            currentUser={currentUser}
            onSelectConversation={selectConversation}
            onNewConversation={() => setSidebarOpen(true)}
          />
        )}
      </div>

      <BottomTabBar
        activeTab={profileOpen ? 'settings' : 'chats'}
        onChatsClick={() => { setProfileOpen(false); navigate('/'); }}
        onSettingsClick={() => setProfileOpen(true)}
      />

      <IncomingCallBanner
        currentUser={currentUser}
        conversations={conversations}
        onAnswer={(session, conv) => {
          setCallType(session?.call_type || 'audio');
          setIncomingCallSession(session);
          setCallConversation(conv || activeConversation);
          setCallOpen(true);
        }}
      />

      <VoiceRecorder
        isOpen={voiceRecorderOpen}
        onClose={() => setVoiceRecorderOpen(false)}
        targetLanguage={myLang}
      />

      {videoRecorderOpen && (
        <VideoFilePicker onClose={() => setVideoRecorderOpen(false)} />
      )}

      <VoiceCallModal
        isOpen={callOpen}
        onClose={() => { setCallOpen(false); setIncomingCallSession(null); }}
        conversation={callConversation}
        currentUser={currentUser}
        callSession={incomingCallSession}
        callType={callType}
      />

      <PWAInstallBanner />

      <ContactDiscovery
        isOpen={contactDiscoveryOpen}
        onClose={() => setContactDiscoveryOpen(false)}
        currentUser={currentUser}
        onStartConversation={async (user) => {
          const otherId = user?._id || user?.id;
          if (!otherId || !currentUser?._id) return;
          const myLangCode = currentUser.defaultLanguage || 'en';
          const convId = await createConvMutation({
            participantName: user.fullName || user.username || 'Contact',
            preferredLanguage: myLangCode,
            participantIds: [currentUser._id, otherId],
            participantNames: [currentUser.fullName || currentUser.email || '', user.fullName || user.username || ''],
            participantLanguages: JSON.stringify({ [currentUser._id]: myLangCode, [otherId]: 'en' }),
            isGroup: false,
          });
          navigate(`/chat/${convId}`);
          setContactDiscoveryOpen(false);
        }}
      />

      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-[500] text-center py-1 text-xs font-medium" style={{ background: 'var(--primary)', color: 'var(--paper)' }}>
          You're offline. Messages will send when reconnected.
        </div>
      )}

      <BlockReportModal
        isOpen={!!blockReportTarget}
        conversation={blockReportTarget}
        currentUser={currentUser}
        onClose={() => setBlockReportTarget(null)}
      />

      {globalSearchOpen && (
        <GlobalSearch
          conversations={conversations}
          onSelect={selectConversation}
          onClose={() => setGlobalSearchOpen(false)}
        />
      )}

      <OnboardingModal
        isOpen={!onboardingDone && !!currentUser}
        currentUser={currentUser}
        onComplete={() => {
          localStorage.setItem('vl_onboarded', '1');
          setOnboardingDone(true);
        }}
      />

      <ForgeGuideNode
        currentUser={currentUser}
        conversations={conversations}
        loaded={!!rawConversations}
        onConversationReady={(conv) => navigate(`/chat/${conv._id}`)}
      />

      <UserProfile
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentUserId={currentUser?._id}
      />
    </div>
  );
}
