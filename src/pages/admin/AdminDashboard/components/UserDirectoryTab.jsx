import React, { useMemo, useEffect } from 'react';
import {
  Search,
  Users,
  Settings as SettingsIcon,
  ChevronLeft,
} from 'lucide-react';
import DashboardSection from '../../../../components/molecules/dashboard/DashboardSection';

const ITEMS_PER_PAGE = 7;

const UserDirectoryTab = ({
  data,
  currentPage,
  setCurrentPage,
  searchQuery,
  debouncedSearchQuery = '',
  setSearchQuery,
  setEditingUser,
}) => {
  const { filteredUsers, paginatedUsers, totalPages, startIndex, endIndex } =
    useMemo(() => {
      const rawUsers = Array.isArray(data?.users)
        ? data.users.filter(Boolean)
        : [];
      const filtered = rawUsers.filter(
        (u) =>
          (u?.name || '')
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          (u?.email || '')
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          (u?.role || '')
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      );

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginated = filtered.slice(start, end);
      const pages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

      return {
        filteredUsers: filtered,
        paginatedUsers: paginated,
        totalPages: pages || 1,
        startIndex: filtered.length > 0 ? start + 1 : 0,
        endIndex: Math.min(end, filtered.length),
      };
    }, [data?.users, debouncedSearchQuery, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const paginationRange = useMemo(() => {
    const range = [];
    const delta = 1;

    range.push(1);

    if (currentPage > delta + 2) {
      range.push('...');
    }

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - delta - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DashboardSection title="User Management" icon={<Users size={14} />}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 px-1">
          <div className="relative group flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="SEARCH_OPERATIVES..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 bg-black border border-white/10 rounded-none px-4 pl-10 text-[10px] text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10 font-black uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white/20 text-[9px] uppercase font-black tracking-[0.2em] border-b border-white/10">
                <th className="pb-3 px-2">USER DETAILS</th>
                <th className="pb-3 px-2">ROLE</th>
                <th className="pb-3 px-2 text-center">STATUS</th>
                <th className="pb-3 px-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-black uppercase tracking-widest">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u, idx) => {
                  const userId = u.id || u._id || u.email || `user-${idx}`;
                  const userName = u.name || 'Unknown';
                  const userEmail = u.email || '';
                  const userRole = u.role || '';
                  const userStatus = u.status || 'Inactive';
                  return (
                    <tr
                      key={userId}
                      className="hover:bg-white/5 transition-colors group cursor-default"
                    >
                      <td className="py-3 px-2 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/20 uppercase">
                            {userName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white group-hover:text-primary transition-colors">
                              {userName}
                            </span>
                            <span className="text-[8px] text-white/20 tracking-tighter uppercase font-black">
                              {userEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 border-b border-white/5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                          {userRole.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2 border-b border-white/5">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-none ${userStatus === 'Active' ? 'bg-status-success' : 'bg-status-error'}`}
                          />
                          <span
                            className={`text-[8px] font-black uppercase tracking-widest ${userStatus === 'Active' ? 'text-status-success' : 'text-status-error'}`}
                          >
                            {userStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right border-b border-white/5">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                        >
                          <SettingsIcon size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-16 text-center border-b border-white/5"
                  >
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
                      NO_USER_RECORDS_MATCHING_CRITERIA
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="py-4 flex items-center justify-between border-t border-white/5 mt-2">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
              OPS_LOG: {startIndex} - {endIndex} / {filteredUsers.length}{' '}
              ENTRIES
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-white disabled:opacity-10 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-1 px-2">
                {paginationRange.map((pageNumber, pageIdx) => {
                  if (pageNumber === '...') {
                    return (
                      <span
                        key={`dots-${pageIdx}`}
                        className="w-6 h-6 flex items-center justify-center text-[9px] font-black text-white/20"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`page-${pageNumber}`}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-6 h-6 rounded-none text-[9px] font-black transition-all cursor-pointer ${currentPage === pageNumber ? 'bg-primary text-black' : 'text-white/20 hover:text-white'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-white disabled:opacity-10 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} className="rotate-180" />
              </button>
            </div>
          </div>
        )}
      </DashboardSection>
    </div>
  );
};

export default UserDirectoryTab;
