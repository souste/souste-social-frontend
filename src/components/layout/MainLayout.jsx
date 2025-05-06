import SidebarMenu from "../menu/SidebarMenu";

const MainLayout = ({ children }) => {
  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
      <div className="sm:col-span-1">
        <SidebarMenu />
      </div>
      <div className="sm:col-span-4">{children}</div>
    </div>
  );
};

export default MainLayout;
