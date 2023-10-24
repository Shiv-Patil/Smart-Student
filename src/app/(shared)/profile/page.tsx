import { Edit2 } from "lucide-react";
import EditAvatar from "~/components/(shared)/EditAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { getServerAuthSession } from "~/server/auth";

const Profile = async () => {
  const session = await getServerAuthSession();

  return (
    <>
      <Card className="mt-24 w-full">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>User details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full gap-8 py-4 max-md:flex-col">
            <div className="flex flex-1 flex-col items-end max-md:items-center">
              <Avatar className="relative h-48 w-48 max-md:h-36 max-md:w-36">
                <AvatarImage src={session?.user.image || ""} />
                <AvatarFallback>?</AvatarFallback>
                <EditAvatar className="hover:opacity-50 absolute bottom-0 left-0 right-0 top-0 rounded-full bg-background opacity-0 transition-opacity" />
              </Avatar>
            </div>
            <div className="flex flex-1 flex-col items-start justify-center gap-2 max-md:items-center">
              <p className="text-3xl">{session?.user.name}</p>
              <p className="text-sm text-secondary-foreground">
                {session?.user.email}
              </p>
              <Badge className="mt-1">
                {session?.user.role.toLowerCase()}@bits
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Profile;
