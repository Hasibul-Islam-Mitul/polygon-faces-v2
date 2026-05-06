/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  departments: string[];
}

export default function Filters({ search, setSearch, department, setDepartment, departments }: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-12">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#7b3fe4] transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#131722] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7b3fe4] focus:ring-1 focus:ring-[#7b3fe4] transition-all"
        />
      </div>

      <div className="relative min-w-[200px]">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full bg-[#131722] border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white appearance-none focus:outline-none focus:border-[#7b3fe4] focus:ring-1 focus:ring-[#7b3fe4] cursor-pointer"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
