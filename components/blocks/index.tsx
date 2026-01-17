import { FieldSeparator } from "@/components/ui/field"

import { AppearanceSettings } from "./appearance-settings"
import { ButtonGroupDemo } from "./button-group-demo"
import { ButtonGroupInputGroup } from "./button-group-input-group"
import { ButtonGroupNested } from "./button-group-nested"
import { ButtonGroupPopover } from "./button-group-popover"
import { EmptyAvatarGroup } from "./empty-avatar-group"
import { FieldCheckbox } from "./field-checkbox"
import { FieldDemo } from "./field-demo"
import { FieldHear } from "./field-hear"
import { FieldSlider } from "./field-slider"
import { InputGroupButtonExample } from "./input-group-button"
import { InputGroupDemo } from "./input-group-demo"
import { ItemDemo } from "./item-demo"
import { NotionPromptForm } from "./notion-prompt-form"
import { SpinnerBadge } from "./spinner-badge"
import { SpinnerEmpty } from "./spinner-empty"
import ChartsDisplay from "../charts"

export function RootComponents() {
  return (
    /* 1. Mark the wrapper as a container */
    <div className="@container w-full py-8 font-inter">
      <p className="py-4 text-sm text-muted-foreground font-jetbrains-mono">Preview Components</p>
      <div className="mx-auto grid gap-6 py-1
        grid-cols-1
        @xl:grid-cols-2
        @4xl:grid-cols-3
        @6xl:grid-cols-4
        @xl:gap-6
        @2xl:gap-8"
      >
        <div className="flex flex-col gap-6 w-full min-w-0">
          <FieldDemo />
        </div>
        <div className="flex flex-col gap-6 w-full min-w-0">
          <EmptyAvatarGroup />
          <SpinnerBadge />
          <ButtonGroupInputGroup />
          <FieldSlider />
          <InputGroupDemo />
        </div>
        <div className="flex flex-col gap-6 w-full min-w-0">
          <InputGroupButtonExample />
          <ItemDemo />
          <FieldSeparator className="my-4">Appearance Settings</FieldSeparator>
          <AppearanceSettings />
        </div>
        <div className="flex flex-col gap-6 w-full min-w-0 order-first @6xl:order-last">
          <NotionPromptForm />
          <ButtonGroupDemo />
          <FieldCheckbox />
          <div className="flex justify-between gap-4">
            <ButtonGroupNested />
            <ButtonGroupPopover />
          </div>
          <FieldHear />
          <SpinnerEmpty />
        </div>
      </div>
          <ChartsDisplay />
    </div>
  )
}