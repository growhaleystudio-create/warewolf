import React from "react";
import { RoleId } from "@/lib/types";
import { WerewolfIcon } from "./WerewolfIcon";
import { VillagerIcon } from "./VillagerIcon";
import { SeerIcon } from "./SeerIcon";
import { DoctorIcon } from "./DoctorIcon";
import { BodyguardIcon } from "./BodyguardIcon";
import { WitchIcon } from "./WitchIcon";
import { HunterIcon } from "./HunterIcon";
import { JesterIcon } from "./JesterIcon";

interface RoleIconProps {
  role: RoleId;
  className?: string;
}

export function RoleIcon({ role, className = "w-16 h-16" }: RoleIconProps) {
  switch (role) {
    case "WEREWOLF":
      return <WerewolfIcon className={className} />;
    case "VILLAGER":
      return <VillagerIcon className={className} />;
    case "SEER":
      return <SeerIcon className={className} />;
    case "DOCTOR":
      return <DoctorIcon className={className} />;
    case "BODYGUARD":
      return <BodyguardIcon className={className} />;
    case "WITCH":
      return <WitchIcon className={className} />;
    case "HUNTER":
      return <HunterIcon className={className} />;
    case "JESTER":
      return <JesterIcon className={className} />;
    default:
      return <VillagerIcon className={className} />;
  }
}
