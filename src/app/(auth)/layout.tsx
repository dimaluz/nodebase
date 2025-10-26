import { AuthLayout } from "@/features/auth/components/auth-layout";
import Link from "next/link";

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
};

export default Layout;