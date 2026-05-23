import React from 'react';

const TLHeader = () => {
  return (
    <div className="flex flex-col border-b border-white/5 pb-5">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          Tech Lead Dashboard
        </h1>
        <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
          Ship quality software, unblock your team, and drive technical
          excellence.
        </p>
      </div>
    </div>
  );
};

export default TLHeader;
