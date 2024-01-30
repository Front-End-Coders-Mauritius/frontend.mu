import IconChicken from "~icons/icon-park-twotone/chicken";
import IconVegan from "~icons/iconoir/vegan";
import IconBus from "~icons/mdi/bus-side";
import IconCar from "~icons/mdi/car-side";
import IconBroom from "~icons/game-icons/magic-broom";
import IconRide from "~icons/ic/round-thumb-up-off-alt";
import IconNoFood from "~icons/radix-icons/component-none";

import IconPhone from "~icons/material-symbols/phone-android-outline-rounded";
import IconEmail from "~icons/material-symbols/mail-outline-rounded";
import IconPublic from "~icons/material-symbols/public";

import IconDeveloper from "~icons/ic/round-code";
import IconStudent from "~icons/ph/student";
import IconManager from "~icons/material-symbols/person-celebrate-rounded";
import IconDesigner from "~icons/ph/paint-brush-duotone";
import IconHr from "~icons/mdi/briefcase-account";

import type { Meal, Occupation, Transport } from "@utils/types";

export const foodOptions = [
    { value: "none", name: "None", icon: IconNoFood },
    { value: "veg", name: "Veg", icon: IconVegan },
    { value: "non_veg", name: "Non/Veg", icon: IconChicken },
] as { value: Meal, name: string, icon: astroHTML.JSX.Element }[];

export const professionOptions = [
    { value: "developer", name: "Developer", icon: IconDeveloper },
    { value: "student", name: "Student", icon: IconStudent },
    { value: "manager", name: "Manager", icon: IconManager },
    { value: "designer", name: "Designer", icon: IconDesigner },
    { value: "hr", name: "Hr", icon: IconHr },
    { value: "other", name: "Other", icon: IconHr },
] as { value: Occupation, name: string, icon: astroHTML.JSX.Element }[];

export const showMeAsAttendingOptions = [
    { value: "true", name: "Public", icon: IconPublic },
    { value: "false", name: "Hide", icon: IconNoFood },
];

export const transportOptions = [
    { value: "bus", name: "Bus", icon: IconBus },
    { value: "car", name: "Car", icon: IconCar },
    { value: "need_a_ride", name: "Need a ride", icon: IconRide },
    { value: "other", name: "Other", icon: IconBroom },
] as { value: Transport, name: string, icon: astroHTML.JSX.Element }[];