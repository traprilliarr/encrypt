'use client';

import Avatar from '@/app/components/Avatar';
import useActiveList from '@/app/hooks/useActiveList';
import { conversation } from '@/app/hooks/useConversation';
import useOtherUser from '@/app/hooks/useOtherUser';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  conversation: conversation;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  // @ts-ignore
  const isActive = members.indexOf(otherUser?.email) !== -1;

  const statusText = useMemo(() => {
    // if (conversation.isGroup) {
    //   return `${conversation.users.length} members`;
    // }

    return isActive ? 'Active' : 'Offline';
  }, [isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="lg:hidden block text-cyan-500 hover:text-cyan-600 transition cursor-pointer"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          {/* {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : ( */}
          <Avatar user={otherUser} />
          {/* )} */}

          <div className="flex flex-col">
            <div>
              {otherUser?.user.fullname}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        <HiEllipsisHorizontal
          className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition"
          size={32}
          onClick={() => setDrawerOpen(true)}
        />
      </div>
    </>
  );
};
export default Header;
