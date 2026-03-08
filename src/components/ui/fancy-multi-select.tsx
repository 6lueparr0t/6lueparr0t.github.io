"use client";

import * as React from "react";

import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

export type Option = Record<"value" | "label", string>;

interface FancyMultiSelectProps {
  options?: Option[];
  value?: Option[];
  onChange?: (value: Option[]) => void;
  placeholder?: string;
  creatable?: boolean;
}

const FRAMEWORKS = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "wordpress", label: "WordPress" },
  { value: "express.js", label: "Express.js" },
  { value: "nest.js", label: "Nest.js" },
] satisfies Option[];

export function FancyMultiSelect({
  options = FRAMEWORKS,
  value,
  onChange,
  placeholder = "Select frameworks...",
  creatable = false,
}: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [internalSelected, setInternalSelected] = React.useState<Option[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const selected = value ?? internalSelected;
  const setSelected = React.useCallback(
    (newSelected: Option[] | ((prev: Option[]) => Option[])) => {
      if (onChange) {
        // If controlled, we need to calculate the new value and call onChange
        // But since we can't easily access the current 'value' inside a callback if it's not a state setter,
        // we rely on 'selected' being up to date.
        // However, 'onChange' expects the new value.
        let nextValue: Option[];
        if (typeof newSelected === "function") {
          nextValue = newSelected(selected);
        } else {
          nextValue = newSelected;
        }
        onChange(nextValue);
      } else {
        if (typeof newSelected === "function") {
          setInternalSelected(newSelected(internalSelected));
        } else {
          setInternalSelected(newSelected);
        }
      }
    },
    [onChange, selected, internalSelected]
  );

  const handleUnselect = React.useCallback(
    (option: Option) => {
      setSelected((prev) => prev.filter((s) => s.value !== option.value));
    },
    [setSelected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
        if (e.key === "Enter" && creatable && inputValue.trim() !== "") {
          // Check if already selected
          const exists = selected.some((s) => s.value === inputValue);
          if (!exists) {
            const newOption = { value: inputValue, label: inputValue };
            setSelected((prev) => [...prev, newOption]);
            setInputValue("");
            e.preventDefault();
          }
        }
      }
    },
    [creatable, inputValue, selected, setSelected]
  );

  const selectables = options.filter((option) => !selected.some((s) => s.value === option.value));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2 z-20">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        setSelected((prev) => [...prev, option]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
