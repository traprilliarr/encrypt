'use client';

import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import MobileFooterItem from './MobileFooterItem';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const MobileFooter = () => {
  const routes = useRoutes();

  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }

    return params?.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => {
    return !!conversationId;
  }, [conversationId]);

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
      {routes.map((route) => (
        <MobileFooterItem
          key={route.label}
          href={route.href}
          icon={route.icon}
          active={route.active}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};
export default MobileFooter;
