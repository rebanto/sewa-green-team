import { ChevronDown, ChevronUp, Copy } from 'lucide-react';

const AllUsersTab = ({
  allUsers,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter,
  roles,
  statusOptions,
  filterUsers,
  expandedUserId,
  toggleExpand,
  copyToClipboard,
  generateBulkList
}: any) => (
  <>
    <div className="max-w-md mx-auto mb-6 flex flex-wrap justify-center gap-6">
      <div className="flex flex-col items-start gap-1">
        <label className="font-semibold text-gray-700">Filter by Role:</label>
        <select
          value={userRoleFilter}
          onChange={e => setUserRoleFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-40"
        >
          {roles.map((r: string) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-start gap-1">
        <label className="font-semibold text-gray-700">Filter by Status:</label>
        <select
          value={userStatusFilter}
          onChange={e => setUserStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-40"
        >
          {statusOptions.map((s: string) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
    <section className="max-w-5xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          className="flex items-center gap-2 bg-[#8a9663] text-white px-4 py-2 rounded-full hover:bg-[#707845]"
          onClick={() => copyToClipboard(generateBulkList('email'))}
          title="Copy all filtered user emails"
        >
          Copy Emails <Copy size={16} />
        </button>
        <button
          className="flex items-center gap-2 bg-[#4b5243] text-white px-4 py-2 rounded-full hover:bg-[#373c2a]"
          onClick={() => copyToClipboard(generateBulkList('phone'))}
          title="Copy all filtered user phone numbers"
        >
          Copy Phone Numbers <Copy size={16} />
        </button>
      </div>
      {filterUsers(allUsers, userRoleFilter, userStatusFilter).length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        filterUsers(allUsers, userRoleFilter, userStatusFilter).map((user: any) => (
          <div key={user.id} className="p-6 bg-white border rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{user.full_name}</div>
                <div className="text-sm text-gray-600">
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Role: {user.role}</p>
                  <p>Status: {user.status}</p>
                  <p>Lead ID: {user.lead_id}</p>
                </div>
              </div>
              <button onClick={() => toggleExpand(user.id)} className="text-[#6b725a]">
                {expandedUserId === user.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {expandedUserId === user.id && (
              <div className="mt-4 text-sm text-gray-700 space-y-2">
                {user.role === 'STUDENT' && (
                  <>
                    <p>Parent 1: {user.parent_1_name} ({user.parent_1_email}, {user.parent_1_phone})</p>
                    <p>Parent 2: {user.parent_2_name} ({user.parent_2_email}, {user.parent_2_phone})</p>
                  </>
                )}
                {user.role === 'PARENT' && (
                  <>
                    <p>Student Name: {user.student_name}</p>
                    <p>Student Email: {user.student_email}</p>
                    <p>Student Phone: {user.student_phone}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </section>
  </>
);

export default AllUsersTab;
