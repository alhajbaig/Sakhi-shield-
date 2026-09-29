import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { Plus, Check, Trash2, Users } from 'lucide-react';
import type { TrustedContact } from '../../lib/mockData';

export const SafetyInformation: React.FC = () => {
  const { user, updateUser } = useApp();
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Guardian');

  const [notificationPref, setNotificationPref] = useState(user.emergencyPreferences.preferredNotification);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const newContact: TrustedContact = {
      id: `tc-${Date.now()}`,
      name: newContactName,
      relationship: newContactRel,
      status: 'Available',
      phone: newContactPhone || '+91 XXXXX XXXXX',
      isPrimary: user.trustedContacts.length === 0,
    };

    updateUser({
      trustedContacts: [...user.trustedContacts, newContact],
    });

    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const handleRemoveContact = (id: string) => {
    updateUser({
      trustedContacts: user.trustedContacts.filter((c) => c.id !== id),
    });
  };

  const handleSavePreferences = () => {
    updateUser({
      emergencyPreferences: {
        ...user.emergencyPreferences,
        preferredNotification: notificationPref,
      },
    });
    alert('Safety preferences saved.');
  };

  return (
    <div className="space-y-6">
      
      {/* Trusted Circle Section */}
      <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1C1917]/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
              EMERGENCY NETWORK
            </span>
            <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
              Trusted Circle Contacts
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAddContact(!showAddContact)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg text-xs font-mono font-bold hover:bg-[#333] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD CONTACT</span>
          </button>
        </div>

        {/* Contact List */}
        <div className="space-y-3">
          {user.trustedContacts.length === 0 ? (
            <div className="p-8 text-center bg-[#FFF2DB]/40 border border-dashed border-[#1C1917]/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-white border border-[#1C1917]/15 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-[#78716C]" />
              </div>
              <p className="font-sans text-sm font-semibold text-[#1C1917] mb-1">
                No trusted contacts configured yet
              </p>
              <p className="font-sans text-xs text-[#78716C] max-w-sm mx-auto mb-4">
                Add friends, family, or campus security who will receive your live GPS coordinate link when an emergency escalation triggers.
              </p>
              <button
                type="button"
                onClick={() => setShowAddContact(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg text-xs font-mono font-bold hover:bg-[#333] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD YOUR FIRST GUARDIAN</span>
              </button>
            </div>
          ) : (
            user.trustedContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#1C1917] text-white font-mono text-sm font-bold flex items-center justify-center">
                    {contact.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-sm text-[#1C1917]">{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-[#FFE5BF] border border-[#1C1917]/20 rounded font-bold text-[#1C1917]">
                          PRIMARY GUARDIAN
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-[#57534E] mt-0.5">
                      {contact.relationship} • {contact.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>{contact.status}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-1.5 text-[#78716C] hover:text-[#F62440] transition-colors cursor-pointer"
                    title="Remove contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Contact Form Drawer */}
        {showAddContact && (
          <form onSubmit={handleAddContact} className="mt-4 p-4 border border-[#1C1917]/20 bg-[#FFF2DB] rounded-xl space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase text-[#1C1917]">
              New Trusted Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Full Name (e.g. Sister, Roommate)"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="p-2.5 bg-white border border-[#1C1917]/20 rounded-lg text-xs font-sans"
              />
              <input
                type="tel"
                placeholder="Phone (+91 98XXX XXXXX)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="p-2.5 bg-white border border-[#1C1917]/20 rounded-lg text-xs font-sans"
              />
              <select
                value={newContactRel}
                onChange={(e) => setNewContactRel(e.target.value)}
                className="p-2.5 bg-white border border-[#1C1917]/20 rounded-lg text-xs font-sans"
              >
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="px-3 py-1.5 border border-[#1C1917]/20 rounded text-xs font-mono font-bold"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1C1917] text-white rounded text-xs font-mono font-bold hover:bg-[#333]"
              >
                SAVE CONTACT
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Emergency Preferences Section */}
      <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
        <div className="pb-4 mb-5 border-b border-[#1C1917]/10">
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
            PROTOCOL CONFIGURATION
          </span>
          <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
            Emergency Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Preferred Notification Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                'Silent SMS + Live Coordinate Link',
                'High-Priority Voice Call Relay',
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNotificationPref(opt)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    notificationPref === opt
                      ? 'border-[#1C1917] bg-[#FFE5BF] font-bold text-[#1C1917]'
                      : 'border-[#1C1917]/15 bg-[#FFF2DB]/40 text-[#57534E]'
                  }`}
                >
                  <span>{opt}</span>
                  {notificationPref === opt && <Check className="w-4 h-4 text-[#F62440]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C1917]/10 flex justify-end">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer"
            >
              UPDATE EMERGENCY PROTOCOL
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
