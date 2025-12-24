import { motion } from "framer-motion";
import FilterSelect from "~/components/ui/FilterSelect";
import UserCard from "~/components/admin/UserCard";
import CopyButton from "~/components/ui/CopyButton";
import { cardVariants, containerVariants } from "~/constants/animations";
import type { AllUsersTabProps } from "~/types";

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
  generateBulkList,
}: AllUsersTabProps) => (
  <>
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#6b7547] text-center mb-8 drop-shadow-sm">
        All Users
      </h2>
      <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-6">
        <FilterSelect
          id="user-role-filter"
          label="Filter by Role"
          value={userRoleFilter}
          onChange={setUserRoleFilter}
          options={roles}
          ariaLabel="Filter users by role"
        />
        <FilterSelect
          id="user-status-filter"
          label="Filter by Status"
          value={userStatusFilter}
          onChange={setUserStatusFilter}
          options={statusOptions}
          ariaLabel="Filter users by status"
        />
      </div>
    </div>
    <section className="max-w-5xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <CopyButton
          onClick={() => copyToClipboard(generateBulkList("email"))}
          variant="primary"
          title="Copy all filtered user emails"
          ariaLabel="Copy all filtered user emails to clipboard"
        >
          Copy Emails
        </CopyButton>
        <CopyButton
          onClick={() => copyToClipboard(generateBulkList("phone"))}
          variant="secondary"
          title="Copy all filtered user phone numbers"
          ariaLabel="Copy all filtered user phone numbers to clipboard"
        >
          Copy Phone Numbers
        </CopyButton>
      </div>
      <motion.section
        className="space-y-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filterUsers(allUsers, userRoleFilter, userStatusFilter).length === 0 ? (
          <motion.div className="text-center py-12" variants={cardVariants}>
            <p className="text-[#c27d50] text-lg font-medium">No users found.</p>
          </motion.div>
        ) : (
          filterUsers(allUsers, userRoleFilter, userStatusFilter).map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isExpanded={expandedUserId === user.id}
              onToggleExpand={toggleExpand}
              showStatus={true}
            />
          ))
        )}
      </motion.section>
    </section>
  </>
);

export default AllUsersTab;
