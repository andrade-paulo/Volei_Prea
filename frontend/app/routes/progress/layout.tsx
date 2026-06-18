import { Outlet } from "react-router";
import { ProgressDataProvider } from "~/components/progress/store";

export default function ProgressLayout() {
  return (
    <ProgressDataProvider>
      <Outlet />
    </ProgressDataProvider>
  );
}
