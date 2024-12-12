import "@/app/globals.css";
import "primeicons/primeicons.css";
import NavBar from "@/components/home/NavBar";

// define general layout with HeaderNavbar on top, LeftSidebar on left, and main content in the middle
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavBar />
            <div>
                {children}
            </div>
        </div>
    );
}
