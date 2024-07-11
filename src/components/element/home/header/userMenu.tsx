// import { auth, signOut } from "@/auth";
// import { SignIn } from "@/components/functional/sign-in";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default async function UserMenu() {
//   const session = await auth();
//   if (session)
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <div className="flex h-full items-center gap-2">
//             <Avatar>
//               <AvatarImage src={session?.user?.image || ""} />
//               <AvatarFallback>{session?.user?.name}</AvatarFallback>
//             </Avatar>
//             <p className="text-xl">{session?.user?.name}</p>
//           </div>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>{session?.user?.email || ""}</DropdownMenuLabel>
//           <DropdownMenuItem>設定</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem asChild>
//             <form
//               action={async () => {
//                 "use server";
//                 await signOut();
//               }}
//             >
//               <Button
//                 type="submit"
//                 variant="ghost"
//                 className="block h-full w-full p-0 text-left font-normal"
//               >
//                 Logout
//               </Button>
//             </form>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   return <SignIn />;
// }
