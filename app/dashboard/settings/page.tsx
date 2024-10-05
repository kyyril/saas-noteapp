import { SubmitButtonSetting } from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });
  return data;
}
export default async function SettingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function postData(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const colorScheme = formData.get("color") as string;

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });
    revalidatePath("/", "layout");
  }

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile settings</p>
        </div>
      </div>

      <Card className="bg-transparent">
        <form action={postData}>
          <CardHeader>
            <CardTitle className="text-primary">General</CardTitle>
            <CardDescription>
              Provide general information about yourself. Don't forget to save.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Name:</Label>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Your Name..."
                  defaultValue={data?.name ?? "default"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Email:</Label>
                <Input
                  name="email"
                  type="text"
                  id="email"
                  placeholder="Your Email..."
                  defaultValue={data?.email ?? "default"}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Color Scheme</Label>
              <Select name="color" defaultValue={data?.colorScheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="select a color.." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* Color options */}
                    <SelectItem value="theme-red">
                      <span className="bg-red-500 rounded-full px-5 py-1">
                        Red
                      </span>
                    </SelectItem>
                    <SelectItem value="theme-blue">
                      <span className="bg-blue-500 rounded-full px-5 py-1">
                        Blue
                      </span>
                    </SelectItem>
                    <SelectItem value="theme-rose">
                      <span className="bg-rose-500 rounded-full px-5 py-1">
                        Rose
                      </span>
                    </SelectItem>
                    <SelectItem value="theme-violet">
                      <span className="bg-violet-500 rounded-full px-5 py-1">
                        Violet
                      </span>
                    </SelectItem>
                    <SelectItem value="theme-green">
                      <span className="bg-green-500 rounded-full px-5 py-1">
                        Green
                      </span>
                    </SelectItem>
                    <SelectItem value="theme-yellow">
                      <span className="bg-yellow-500 rounded-full px-5 py-1">
                        Yellow
                      </span>
                    </SelectItem>
                    <SelectItem value="theme-orange">
                      <span className="bg-orange-500 rounded-full px-5 py-1">
                        Orange
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <SubmitButtonSetting />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
