import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { User, Mail, Phone, Calendar, Check, Edit2 } from 'lucide-react';

export const PersonalInformation: React.FC = () => {
  const { user, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      fullName: name,
      email,
      phone,
    });
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1C1917]/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold">
            IDENTITY DETAILS
          </span>
          <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
            Personal Information
          </h3>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1C1917]/20 rounded-lg text-xs font-mono font-bold hover:bg-[#FFF2DB] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>EDIT</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs font-mono text-[#78716C] hover:text-[#1C1917] cursor-pointer"
          >
            CANCEL
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#1C1917]/25 bg-white font-sans text-sm focus:border-[#F62440] focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-[#FFF2DB]/50 rounded-lg border border-[#1C1917]/10 font-sans text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                <User className="w-4 h-4 text-[#78716C]" />
                <span>{user.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Primary Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#1C1917]/25 bg-white font-sans text-sm focus:border-[#F62440] focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-[#FFF2DB]/50 rounded-lg border border-[#1C1917]/10 font-sans text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#78716C]" />
                <span>{user.email}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Emergency Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#1C1917]/25 bg-white font-sans text-sm focus:border-[#F62440] focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-[#FFF2DB]/50 rounded-lg border border-[#1C1917]/10 font-sans text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#78716C]" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {/* Date of Birth (Optional) */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#78716C] font-bold block mb-1">
              Date of Birth <span className="opacity-60">(Optional)</span>
            </label>
            <div className="p-3 bg-[#FFF2DB]/50 rounded-lg border border-[#1C1917]/10 font-sans text-sm text-[#78716C] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#78716C]" />
              <span>Not shared (Optional)</span>
            </div>
          </div>

        </div>

        {isEditing && (
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-lg font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer"
            >
              SAVE CHANGES
            </button>
          </div>
        )}

        {savedToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-900 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile information successfully updated.</span>
          </div>
        )}
      </form>
    </div>
  );
};
