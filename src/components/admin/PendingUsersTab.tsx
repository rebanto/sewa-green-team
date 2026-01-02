import { motion } from "framer-motion";
import UserCard from "~/components/admin/UserCard";
import { cardVariants, containerVariants } from "~/constants/animations";
import type { PendingUsersTabProps } from "~/types";

const PendingUsersTab = ({
  pendingUsers,
  pendingRoleFilter,
  setPendingRoleFilter,
  pendingStatusFilter,
  setPendingStatusFilter,
  roles,
  statusOptions,
  filterUsers,
  expandedUserId,
  toggleExpand,
  updateUserStatus,
}: PendingUsersTabProps) => (
  <>
    <div className="max-w-2xl mx-auto mb-8 flex flex-wrap justify-center gap-6">
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="pending-role-filter" className="font-semibold text-[#6b7547]">
          Filter by Role:
        </label>
        <select
          id="pending-role-filter"
          value={pendingRoleFilter}
          onChange={(e) => setPendingRoleFilter(e.target.value)}
          className="border border-[#cdd1bc] rounded-lg px-3 py-2 w-40 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-[#8a9663] focus:border-[#8a9663] text-[#6b7547] font-medium"
          aria-label="Filter pending users by role"
        >
          {roles.map((r: string) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="pending-status-filter" className="font-semibold text-[#6b7547]">
          Filter by Status:
        </label>
        <select
          id="pending-status-filter"
          value={pendingStatusFilter}
          onChange={(e) => setPendingStatusFilter(e.target.value)}
          className="border border-[#cdd1bc] rounded-lg px-3 py-2 w-40 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-[#8a9663] focus:border-[#8a9663] text-[#6b7547] font-medium"
          aria-label="Filter pending users by status"
        >
          {statusOptions.map((s: string) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
    <motion.section
      className="space-y-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filterUsers(pendingUsers, pendingRoleFilter, pendingStatusFilter).length === 0 ? (
        <motion.div className="text-center py-12" variants={cardVariants}>
          <p className="text-[#c27d50] text-lg font-medium">No pending users 🎉</p>
        </motion.div>
      ) : (
        filterUsers(pendingUsers, pendingRoleFilter, pendingStatusFilter).map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isExpanded={expandedUserId === user.id}
            onToggleExpand={toggleExpand}
            showStatus={false}
            actions={[
              {
                label: "Approve",
                onClick: () => updateUserStatus(user.id, "APPROVED"),
                className:
                  "px-4 sm:px-6 py-2 sm:py-3 bg-[#8a9663] hover:bg-[#7a8757] text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base",
                ariaLabel: `Approve user ${user.full_name}`,
                title: `Approve user ${user.full_name}`,
              },
              {
                label: "Reject",
                onClick: () => updateUserStatus(user.id, "REJECTED"),
                className:
                  "px-4 sm:px-6 py-2 sm:py-3 bg-[#c27d50] hover:bg-[#a46336] text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base",
                ariaLabel: `Reject user ${user.full_name}`,
                title: `Reject user ${user.full_name}`,
              },
            ]}
          />
        ))
      )}
    </motion.section>
  </>
);

export default PendingUsersTab;
