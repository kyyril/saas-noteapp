import {
  Card,
  CardContent,
  CardDescription,
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

export default function SettingPage() {
  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Your profile settings..
          </p>
        </div>
      </div>
      <Card className="bg-transparent">
        <form>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Provide general information about yourself. don't forget to save
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
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Color Scheme</Label>
              <Select name="color">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="select a color.." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
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
        </form>
      </Card>
    </div>
  );
}
