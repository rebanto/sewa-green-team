import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import StatusBadge from "~/components/ui/StatusBadge";
import { cardVariants } from "~/constants/animations";
import { wrap } from "~/lib/utils";
import type { UserCardProps } from "~/types";

const UserCard = ({
  user,
  isExpanded,
  onToggleExpand,
  actions = [],
  showStatus = false,
  className = "",
  onUpdateRole,
}: UserCardProps) => {
  const renderExpandedContent = () =>
    user.parent_1_name || user.parent_2_name ? (
      <div className="text-sm text-[#6b7547] space-y-2 font-medium">
        {user.role === "STUDENT" && (
          <>
            {user.parent_1_name && (
              <p>
                <span className="font-semibold">Parent 1: </span>
                {`${user.parent_1_name}
            ${wrap([user.parent_1_email, user.parent_1_phone].filter(Boolean).join(", "))
                    .prepend("(")
                    .append(")")}`}
              </p>
            )}
            {user.parent_2_name && (
              <p>
                <span className="font-semibold">Parent 2: </span>
                {`${user.parent_2_name}
            ${wrap([user.parent_2_email, user.parent_2_phone].filter(Boolean).join(", "))
                    .prepend("(")
                    .append(")")}`}
              </p>
            )}
          </>
        )}
        {user.role === "PARENT" && (
          <>
            <p>
              <span className="font-semibold">Student Name:</span> {user.student_name}
            </p>
            <p>
              <span className="font-semibold">Student Email:</span> {user.student_email}
            </p>
            <p>
              <span className="font-semibold">Student Phone:</span> {user.student_phone}
            </p>
          </>
        )}
      </div>
    ) : (
      <div className="text-sm text-[#6b7547] space-y-2 font-medium">
        <p>No additional information available.</p>
      </div>
    );

  return (
    <motion.div
      className={`p-4 sm:p-6 bg-gradient-to-r from-white to-[#f9f8f4] border border-[#cdd1bc] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      variants={cardVariants}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="font-extrabold text-xl text-[#6b7547] mb-2">{user.full_name}</div>
          <div className="text-sm text-[#c27d50] space-y-1 font-medium">
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            {onUpdateRole ? (
              <div className="flex items-center gap-2">
                <span className="min-w-fit">Role:</span>
                <div className="relative inline-block">
                  <select
                    value={user.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      if (window.confirm(`Are you sure you want to change role to ${newRole}?`)) {
                        onUpdateRole(user.id, newRole);
                      }
                    }}
                    className="bg-transparent border-b border-[#c27d50] text-[#c27d50] font-medium focus:outline-none focus:border-[#6b7547] cursor-pointer appearance-none pr-8 py-0 leading-none h-auto w-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="PARENT">PARENT</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#c27d50] pointer-events-none"
                  />
                </div>
              </div>
            ) : (
              <p>Role: {user.role}</p>
            )}
            {showStatus && (
              <p>
                Status: <StatusBadge status={user.status} />
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleExpand(user.id)}
          className="text-[#8a9663] hover:text-[#6b7547] p-2 rounded-full hover:bg-white/50 transition-all duration-200"
          aria-label={isExpanded ? "Collapse user details" : "Expand user details"}
          title={isExpanded ? "Collapse user details" : "Expand user details"}
        >
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 p-4 bg-[#f4f3ec]/50 rounded-xl border border-[#cdd1bc]/30">
          {renderExpandedContent()}
        </div>
      )}

      {actions.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className={action.className}
              aria-label={action.ariaLabel}
              title={action.title}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;
