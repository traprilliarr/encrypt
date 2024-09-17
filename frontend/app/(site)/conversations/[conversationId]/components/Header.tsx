"use client";

import Avatar from "@/app/components/Avatar";
import { conversation } from "@/app/hooks/useConversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";

interface HeaderProps {
  conversation: conversation;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);

  return (
    <>
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="lg:hidden block text-cyan-500 hover:text-cyan-600 transition cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          <Avatar user={otherUser} />
          {otherUser?.user.fullname}
        </div>
      </div>
    </>
  );
};
export default Header;
