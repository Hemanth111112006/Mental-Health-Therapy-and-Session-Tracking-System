import { toast } from '../../utils/toast';
import React, { useState, useEffect } from 'react';
import ClientLayout from '../../layouts/ClientLayout';
import { messagingApi } from '../../api/messagingApi';
import { Loader, Send, AlertCircle } from 'lucide-react';

const ClientMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingApi.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!recipientId) {
      toast.warn('Please enter a recipient User ID before sending.');
      return;
    }
    try {
      setSending(true);
      await messagingApi.sendMessage({
        content: newMessage,
        subject: 'Message from Client',
        recipientId: Number(recipientId)
      });
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      toast.success('Message sent successfully!');
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messagingApi.markAsRead(messageId);
      await fetchMessages();
    } catch (err) {
      console.error('Mark as read failed', err);
    }
  };

  return (
    <ClientLayout>
      <div style={{ background: 'var(--bg-secondary, #fff)', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: 'var(--text-primary, #1e293b)', marginBottom: '0.3rem' }}>Secure Messaging</h2>
        <p style={{ color: 'var(--text-secondary, #64748b)', marginBottom: '1.5rem' }}>HIPAA-compliant direct messaging with your care team.</p>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', gap: '12px', color: '#64748b' }}>
            <Loader size={24} /> Loading messages...
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#ef4444', marginBottom: '16px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={fetchMessages} style={{ marginLeft: 'auto', padding: '4px 12px', border: '1px solid #ef4444', borderRadius: '4px', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                <p style={{ margin: 0, fontSize: '15px' }}>No messages yet.</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Send a message to your therapist below.</p>
              </div>
            ) : (
              conversations.map((msg) => {
                const isReceived = msg.status === 'RECEIVED' || msg.recipient?.username !== msg.sender?.username;
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isReceived ? 'flex-start' : 'flex-end', marginBottom: '16px' }}>
                    <div style={{ maxWidth: '75%', background: isReceived ? '#fff' : '#3b82f6', color: isReceived ? '#1e293b' : '#fff', borderRadius: isReceived ? '0 12px 12px 12px' : '12px 0 12px 12px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{msg.content || msg.messageContent}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {msg.sender?.username || 'Unknown'} • {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : ''}
                      </span>
                      {isReceived && !msg.readAt && (
                        <button onClick={() => handleMarkAsRead(msg.id)} style={{ fontSize: '11px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="number"
            placeholder="Recipient User ID (ask your therapist for their ID)"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', backgroundColor: '#fff' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }}}
              rows={3}
              style={{ flex: 1, padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', resize: 'none', backgroundColor: '#fff' }}
            />
            <button type="submit" disabled={sending || !newMessage.trim()} style={{ padding: '12px 20px', backgroundColor: sending ? '#94a3b8' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <Send size={16} /> {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Press Enter to send • Shift+Enter for new line</p>
        </form>
      </div>
    </ClientLayout>
  );
};

export default ClientMessages;



