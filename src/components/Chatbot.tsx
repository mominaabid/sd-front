import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../constants/urls';
import emailjs from "@emailjs/browser";
interface Message {
  from: 'bot' | 'user';
  text: string;
}

interface VideoType {
  id: number;
  name: string;
  price: number | null;
}

type Step =
  | 'welcome'
  | 'ask_service'
  | 'ask_name'
  | 'ask_email'
  | 'ask_phone'
  | 'ask_company'
  | 'ask_video_types'
  | 'confirm'
  | 'done';

const SERVICES = [
  { label: '📦 Buy a Package (Bundle)', value: 'bundle' },
  { label: '🎬 Create Custom Order', value: 'custom' },
  { label: '👤 Dedicated Editor', value: 'dedicated' },
];
const SERVICE_ID = "service_h0wkiad";
const TEMPLATE_ID = "template_gvttpqq";
const PUBLIC_KEY = "qU_ljJITgXTBKHwWp";
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [showAskLabel, setShowAskLabel] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>('welcome');
  const [input, setInput] = useState('');
  const [videoTypes, setVideoTypes] = useState<VideoType[]>([]);
  const [selectedVideoTypes, setSelectedVideoTypes] = useState<number[]>([]);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    plan: '',
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      addBot("👋 Hi! Welcome to S&D Media. I'm here to help you get started.");
      setTimeout(() => {
        addBot("What service are you interested in?");
        setStep('ask_service');
      }, 800);
    }
  }, [open]);

useEffect(() => {
  const seen = localStorage.getItem("chatbot_seen");
  if (!seen) {
    setShowAskLabel(true);
  }
}, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (step === 'ask_video_types') {
      fetch(`${API_BASE_URL}pricing/video-types/`)
        .then(r => r.json())
        .then(d => setVideoTypes(d.data || []));
    }
  }, [step]);

  const addBot = (text: string) => {
    setMessages(prev => [...prev, { from: 'bot', text }]);
  };

  const addUser = (text: string) => {
    setMessages(prev => [...prev, { from: 'user', text }]);
  };

  const handleServiceSelect = (service: { label: string; value: string }) => {
    addUser(service.label);
    setUserData(prev => ({ ...prev, plan: service.value }));
    setTimeout(() => {
      addBot("Great choice! What's your full name?");
      setStep('ask_name');
    }, 400);
  };

  const handleVideoTypeToggle = (id: number) => {
    setSelectedVideoTypes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleVideoTypesDone = () => {
    const selected = videoTypes.filter(v => selectedVideoTypes.includes(v.id));
    const names = selected.map(v => v.name).join(', ') || 'None selected';
    addUser(names);
    setTimeout(() => {
      const total = selected.reduce((sum, v) => sum + (v.price || 0), 0);
      if (total > 0) {
        addBot(`Estimated total: $${total}`);
      }
      addBot(`Please confirm your details:\n\n👤 ${userData.name}\n📧 ${userData.email}\n📞 ${userData.phone}\n🏢 ${userData.company || '—'}\n📋 ${userData.plan}`);
      addBot('Is everything correct? Type **yes** to submit or **no** to restart.');
      setStep('confirm');
    }, 400);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    addUser(text);

    if (step === 'ask_name') {
      setUserData(prev => ({ ...prev, name: text }));
      setTimeout(() => { addBot("What's your email address?"); setStep('ask_email'); }, 400);
    }
    else if (step === 'ask_email') {
      if (!text.includes('@')) {
        setTimeout(() => addBot('Please enter a valid email address.'), 400);
        return;
      }
      setUserData(prev => ({ ...prev, email: text }));
      setTimeout(() => { addBot("What's your phone number?"); setStep('ask_phone'); }, 400);
    }
    else if (step === 'ask_phone') {
      setUserData(prev => ({ ...prev, phone: text }));
      setTimeout(() => { addBot("Company name? (type - to skip)"); setStep('ask_company'); }, 400);
    }
    else if (step === 'ask_company') {
      setUserData(prev => ({ ...prev, company: text === '-' ? '' : text }));
      if (userData.plan === 'custom') {
        setTimeout(() => { addBot('Select the video types you need:'); setStep('ask_video_types'); }, 400);
      } else {
        setTimeout(() => {
          addBot(`Please confirm your details:\n\n👤 ${userData.name}\n📧 ${userData.email}\n📞 ${userData.phone}\n🏢 ${text === '-' ? '—' : text}\n📋 ${userData.plan}`);
          addBot('Is everything correct? Type **yes** to submit or **no** to restart.');
          setStep('confirm');
        }, 400);
      }
    }
    else if (step === 'confirm') {
      if (text.toLowerCase() === 'yes') {
        await submitLead();
      } else {
        restart();
      }
    }
  };

 const submitLead = async () => {
  addBot('Submitting your inquiry...');

  try {

    const payload = {
      name: userData.name,
      company_name: userData.company,
      phone: userData.phone,
      email: userData.email,
      selected_plan: userData.plan,
      video_types_text: videoTypes
        .filter(v => selectedVideoTypes.includes(v.id))
        .map(v => v.name)
        .join(', '),
      total_price: videoTypes
        .filter(v => selectedVideoTypes.includes(v.id))
        .reduce((sum, v) => sum + (v.price || 0), 0) || null,
    };

    /* ---------------- SEND TO DASHBOARD ---------------- */

    const res = await fetch(`${API_BASE_URL}chatbot/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    /* ---------------- SEND EMAIL USING EMAILJS ---------------- */

  await emailjs.send(
  SERVICE_ID,
  TEMPLATE_ID,
  {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    company: payload.company_name || "-",
    plan: payload.selected_plan,
    video_types: payload.video_types_text || "-",
    total_price: payload.total_price ? `$${payload.total_price}` : "-"
  },
  PUBLIC_KEY
);

    if (res.ok) {
      addBot('✅ Thank you! Your inquiry has been submitted. Our team will contact you shortly.');
      setStep('done');
    } else {
      addBot('❌ Something went wrong. Please try again.');
    }

  } catch (error) {
    addBot('❌ Network error. Please try again.');
  }
};

  const restart = () => {
    setMessages([]);
    setStep('welcome');
    setUserData({ name: '', email: '', phone: '', company: '', plan: '' });
    setSelectedVideoTypes([]);
    setInput('');
    setTimeout(() => {
      addBot("👋 Let's start over! What service are you interested in?");
      setStep('ask_service');
    }, 300);
  };

  return (
    <>
      <style>{`
        .cb-wrap * { box-sizing: border-box; }
        .cb-ask-label {
  position: fixed;
  bottom: 32px;
  right: 92px;
  background: #CDFF00;
  color: #16151A;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  animation: cbFloat 2s ease-in-out infinite;
}

.cb-ask-label::after {
  content: "";
  position: absolute;
  right: -6px;
  top: 12px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent transparent #CDFF00;
}

@keyframes cbFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}
        .cb-bubble {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #CDFF00;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(205,255,0,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cb-bubble:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 32px rgba(205,255,0,0.5);
        }
        .cb-window {
          position: fixed;
          bottom: 92px;
          right: 24px;
          z-index: 9998;
          width: 360px;
          max-width: calc(100vw - 32px);
          height: 520px;
          max-height: calc(100vh - 120px);
          background: #1E1D23;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: cbSlideUp 0.25s ease;
        }
        @keyframes cbSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cb-header {
          background: #252430;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .cb-header-left { display: flex; align-items: center; gap: 10px; }
        .cb-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #CDFF00;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 14px; color: #16151A;
        }
        .cb-title { font-weight: 700; font-size: 14px; color: #F0EFFF; }
        .cb-sub { font-size: 11px; color: #6B698A; }
        .cb-close-btn {
          background: none; border: none; cursor: pointer;
          color: #6B698A; padding: 4px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          display: flex; align-items: center;
        }
        .cb-close-btn:hover { color: #F0EFFF; background: rgba(255,255,255,0.07); }
        .cb-messages {
          flex: 1; overflow-y: auto; padding: 14px 12px;
          display: flex; flex-direction: column; gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .cb-messages::-webkit-scrollbar { width: 3px; }
        .cb-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .cb-msg {
          max-width: 82%;
          padding: 10px 13px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .cb-msg.bot {
          background: #252430;
          color: #F0EFFF;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
        }
        .cb-msg.user {
          background: #CDFF00;
          color: #16151A;
          font-weight: 600;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }
        .cb-service-btn {
          background: #252430;
          border: 1px solid rgba(255,255,255,0.1);
          color: #F0EFFF;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
        }
        .cb-service-btn:hover { border-color: #CDFF00; background: rgba(205,255,0,0.06); }
        .cb-vt-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 12px;
          background: #252430;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.15s;
          margin-bottom: 6px;
        }
        .cb-vt-item.selected { border-color: #CDFF00; background: rgba(205,255,0,0.06); }
        .cb-vt-name { font-size: 13px; color: #F0EFFF; }
        .cb-vt-price { font-size: 12px; color: #CDFF00; font-weight: 700; }
        .cb-vt-done {
          width: 100%; padding: 9px;
          background: #CDFF00; color: #16151A;
          border: none; border-radius: 10px;
          font-weight: 700; font-size: 13px;
          cursor: pointer; margin-top: 4px;
          transition: background 0.15s;
        }
        .cb-vt-done:hover { background: #d9ff1a; }
        .cb-input-row {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          background: #1E1D23;
        }
        .cb-input {
          flex: 1;
          background: #252430;
          border: 1px solid rgba(255,255,255,0.1);
          color: #F0EFFF;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .cb-input:focus { border-color: #CDFF00; }
        .cb-input::placeholder { color: #6B698A; }
        .cb-send {
          width: 36px; height: 36px;
          background: #CDFF00;
          border: none; border-radius: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.15s;
        }
        .cb-send:hover { background: #d9ff1a; transform: scale(1.05); }
        .cb-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; flex-shrink: 0; }
      `}</style>

      <div className="cb-wrap">
          {showAskLabel && !open && (
    <div className="cb-ask-label">
      Ask chatbot
    </div>
  )}
        {/* Bubble button */}
        <button className="cb-bubble" onClick={() => {
  setOpen(o => !o);
  setShowAskLabel(false);
  localStorage.setItem("chatbot_seen", "true");
}}aria-label="Chat">
        {open
  ? <ChevronDown className="w-5 h-5" style={{ color: '#16151A' }} />
  : <Bot className="w-5 h-5" style={{ color: '#16151A' }} />
}
        </button>

        {/* Chat window */}
        {open && (
          <div className="cb-window">
            {/* Header */}
            <div className="cb-header">
              <div className="cb-header-left">
                <div className="cb-avatar">S</div>
                <div>
                  <div className="cb-title">S&D Media</div>
                  <div className="cb-sub" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="cb-dot"></span> Online
                  </div>
                </div>
              </div>
              <button className="cb-close-btn" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="cb-messages">
              {messages.map((m, i) => (
                <div key={i} className={`cb-msg ${m.from}`}>{m.text}</div>
              ))}

              {/* Service selection buttons */}
              {step === 'ask_service' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignSelf: 'flex-start', width: '90%' }}>
                  {SERVICES.map(s => (
                    <button key={s.value} className="cb-service-btn" onClick={() => handleServiceSelect(s)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Video type checkboxes */}
              {step === 'ask_video_types' && (
                <div style={{ alignSelf: 'flex-start', width: '92%' }}>
                  {videoTypes.map(v => (
                    <div
                      key={v.id}
                      className={`cb-vt-item ${selectedVideoTypes.includes(v.id) ? 'selected' : ''}`}
                      onClick={() => handleVideoTypeToggle(v.id)}
                    >
                      <span className="cb-vt-name">{v.name}</span>
                      <span className="cb-vt-price">{v.price ? `$${v.price}` : '—'}</span>
                    </div>
                  ))}
                  <button className="cb-vt-done" onClick={handleVideoTypesDone}>
                    Done ✓
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input row — hide during service/video type selection and after done */}
            {step !== 'ask_service' && step !== 'ask_video_types' && step !== 'done' && step !== 'welcome' && (
              <div className="cb-input-row">
                <input
                  className="cb-input"
                  placeholder="Type your answer..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  autoFocus
                />
                <button className="cb-send" onClick={handleSend}>
                  <Send className="w-4 h-4" style={{ color: '#16151A' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
