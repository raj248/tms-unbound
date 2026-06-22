// "use client";

// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/auth-context";
// import {
//   Menu,
//   LayoutDashboard,
//   BookType,
//   Users,
//   History,
//   FileCode,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// export function MainNav() {
//   const { isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const dashboardPath = isAdmin ? "/admin/dashboard" : "/author/dashboard";
//   const booksPath = isAdmin ? "/books/all" : "/books";

//   const navItems = [
//     { label: "Dashboard", path: dashboardPath, icon: LayoutDashboard },
//     {
//       label: isAdmin ? "All Books" : "Books",
//       path: booksPath,
//       icon: BookType,
//     },
//     ...(isAdmin
//       ? [
//           { label: "Authors", path: "/admin/authors", icon: Users },
//           { label: "Timeline", path: "/timeline", icon: History },
//           { label: "Data Format", path: "/admin/data-format", icon: FileCode },
//           { label: "Export", path: "/admin/export", icon: FileCode },
//         ]
//       : []),
//   ];

//   const handleNavigate = (path: string) => {
//     navigate(path);
//     setIsOpen(false);
//   };

//   return (
//     <div className="flex items-center justify-between md:justify-start gap-8 px-4 py-2 bg-background">
//       {/* --- MOBILE NAVIGATION --- */}
//       <div className="md:hidden">
//         <Sheet open={isOpen} onOpenChange={setIsOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="text-primary">
//               <Menu className="h-6 w-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent
//             side="left"
//             className="w-[300px] p-0 border-r-4 border-primary"
//           >
//             <SheetHeader className="p-6 text-left border-b bg-muted/20">
//               <SheetTitle className="flex items-center gap-3">
//                 <div className="h-8 w-8 bg-white rounded-lg border flex items-center justify-center p-1">
//                   <img
//                     src="/unbound-logo.webp"
//                     alt="Logo"
//                     className="object-contain"
//                   />
//                 </div>
//                 <div className="flex flex-col leading-none">
//                   <span className="font-black uppercase tracking-tighter">
//                     Unbound
//                   </span>
//                   <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
//                     Script
//                   </span>
//                 </div>
//               </SheetTitle>
//             </SheetHeader>

//             <div className="flex flex-col gap-1 p-4">
//               {navItems.map((item) => (
//                 <Button
//                   key={item.path}
//                   variant="ghost"
//                   className="w-full justify-start gap-4 h-12 font-black uppercase tracking-tighter text-sm group"
//                   onClick={() => handleNavigate(item.path)}
//                 >
//                   <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
//                   {item.label}
//                 </Button>
//               ))}
//             </div>

//             <div className="absolute bottom-4 left-0 right-0 px-6">
//               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center border-t pt-4 border-dashed">
//                 Publishing Suite v1.0
//               </p>
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* --- LOGO SECTION --- */}
//       <div
//         className="flex items-center gap-3 cursor-pointer group shrink-0"
//         onClick={() => navigate(dashboardPath)}
//       >
//         <div className="relative h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-border/50 shadow-sm transition-all group-hover:scale-105 group-hover:rotate-3 overflow-hidden transform-gpu">
//           <img
//             src="/unbound-logo.webp"
//             alt="Unbound Script Logo"
//             className="h-7 w-7 object-contain antialiased"
//           />
//         </div>

//         <div className="flex flex-col leading-none">
//           <span className="font-black tracking-tighter text-xl uppercase">
//             Unbound
//           </span>
//           <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground ml-0.5">
//             Script
//           </span>
//         </div>
//       </div>

//       {/* --- DESKTOP NAVIGATION --- */}
//       <NavigationMenu className="hidden md:flex">
//         <NavigationMenuList className="flex-wrap">
//           {navItems.map((item) => (
//             <NavigationMenuItem key={item.path}>
//               <NavigationMenuLink
//                 className={cn(
//                   navigationMenuTriggerStyle(),
//                   "cursor-pointer font-bold uppercase text-[11px] tracking-tight",
//                 )}
//                 onClick={() => navigate(item.path)}
//               >
//                 {item.label}
//               </NavigationMenuLink>
//             </NavigationMenuItem>
//           ))}
//         </NavigationMenuList>
//       </NavigationMenu>
//     </div>
//   );
// }
