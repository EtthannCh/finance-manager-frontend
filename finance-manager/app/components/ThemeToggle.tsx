"use client"

import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"


export function ThemeToggle() {
  const {theme, setTheme} = useTheme();

  return (
    <div className="flex">
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0" />
      <Switch onCheckedChange={(checked) => {
        setTheme(checked? "dark":"light")
      }}></Switch>
      <Moon className={`h-[1.2rem] w-[1.2rem] scale-100 rotate-0 `} />
    </div>
  )
}
