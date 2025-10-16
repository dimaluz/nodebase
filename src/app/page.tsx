
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

const Page = async () => {

  await requireAuth();

  const data = await caller.getUsers()

  return(
    <div className='min-h-screen min-w-screen flex items-center justify-center'>
      {JSON.stringify(data)}
    </div>
  );
};

export default Page;