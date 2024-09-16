import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

async function Sidebar({ children, user }: { children: React.ReactNode, user: any }) {
  return (
    <div className=" h-full">
      <DesktopSidebar currentUser={user} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
