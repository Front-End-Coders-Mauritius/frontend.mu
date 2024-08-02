import { Icon } from '#components'
import type { RendererElement } from 'vue'

import type { Meal, Occupation, Transport } from "@/utils/types";

const IconChicken = h(Icon, { name: 'icon-park-twotone:chicken'})
const IconVegan = h(Icon, { name: 'iconoir:vegan'})
const IconBus = h(Icon, { name: 'mdi:bus-side'})
const IconCar = h(Icon, { name: 'mdi:car-side'})
const IconBroom = h(Icon, { name: 'game-icons:magic-broom'})
const IconRide = h(Icon, { name: 'ic:round-thumb-up-off-alt'})
const IconNoFood = h(Icon, { name: 'radix-icons:component-none'})

const IconPhone = h(Icon, { name: 'material-symbols:phone-android-outline-rounded'})
const IconEmail = h(Icon, { name: 'material-symbols:mail-outline-rounded'})
const IconPublic = h(Icon, { name: 'material-symbols:public'})

const IconDeveloper = h(Icon, { name: 'ic:round-code'})
const IconStudent = h(Icon, { name: 'ph:student'})
const IconManager = h(Icon, { name: 'material-symbols:person-celebrate-rounded'})
const IconDesigner = h(Icon, { name: 'ph:paint-brush-duotone'})
const IconHr = h(Icon, { name: 'mdi:briefcase-account'})
const IconEntrepreneur = h(Icon, { name: 'mdi:head-cog-outline'})

export const foodOptions = [
    { value: "none", name: "None", icon: IconNoFood },
    { value: "veg", name: "Veg", icon: IconVegan },
    { value: "non_veg", name: "Non/Veg", icon: IconChicken },
] as { value: Meal, name: string, icon: RendererElement }[];

export const professionOptions = [
    { value: "developer", name: "Developer", icon: IconDeveloper },
    { value: "student", name: "Student", icon: IconStudent },
    { value: "manager", name: "Manager", icon: IconManager },
    { value: "designer", name: "Designer", icon: IconDesigner },
    { value: "hr", name: "Hr", icon: IconHr },
    { value: "entrepreneur", name: "Entrepreneur", icon: IconEntrepreneur },
    { value: "other", name: "Other", icon: IconHr },
] as { value: Occupation, name: string, icon: RendererElement }[];

export const showMeAsAttendingOptions = [
    { value: "true", name: "Public", icon: IconPublic },
    { value: "false", name: "Hide", icon: IconNoFood },
];

export const transportOptions = [
    { value: "bus", name: "Bus", icon: IconBus },
    { value: "car", name: "Car", icon: IconCar },
    { value: "need_a_ride", name: "Need a ride", icon: IconRide },
    { value: "other", name: "Other", icon: IconBroom },
] as { value: Transport, name: string, icon: RendererElement }[];