"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "cmdk";
import { Check, ChevronDown, X } from "lucide-react";
import { site, type ServiceId } from "@/content/site";
import FieldLabel from "@/components/contact/FieldLabel";

const MAX_VISIBLE_CHIPS = 2;

interface ServicesMultiSelectProps {
  value: ServiceId[];
  onChange: (next: ServiceId[]) => void;
  error?: string;
}

export default function ServicesMultiSelect({ value, onChange, error }: ServicesMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (id: ServiceId) => {
    onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id]);
  };
  const removeOne = (id: ServiceId) => {
    onChange(value.filter((s) => s !== id));
  };
  const clearAll = () => onChange([]);

  const selectedServices = site.services.filter((s) => value.includes(s.id));
  const visibleChips = selectedServices.slice(0, MAX_VISIBLE_CHIPS);
  const extraCount = selectedServices.length - visibleChips.length;

  return (
    <div>
      <FieldLabel htmlFor="services-select" required>
        Services Interested In
      </FieldLabel>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div
            id="services-select"
            role="button"
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
            className={`flex h-12 w-full cursor-pointer items-center gap-2 rounded-[14px] border bg-[rgba(255,253,248,0.04)] px-4 outline-none transition-colors focus:ring-[3px] ${
              error
                ? "border-[#E5484D] focus:border-[#E5484D] focus:ring-[#E5484D]/20"
                : "border-deep-line focus:border-copper focus:ring-copper/25"
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {selectedServices.length === 0 ? (
                <span className="text-base text-mist/60">Select services</span>
              ) : (
                <>
                  {visibleChips.map((s) => (
                    <span
                      key={s.id}
                      className="flex items-center gap-1 rounded-full bg-copper/15 py-1 pl-2.5 pr-1.5 text-xs font-medium text-ivory"
                    >
                      {s.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOne(s.id);
                        }}
                        aria-label={`Remove ${s.name}`}
                        className="flex h-4 w-4 items-center justify-center rounded-full text-mist transition-colors hover:bg-copper hover:text-pounamu-night"
                      >
                        <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                      </button>
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="font-mono-label text-[11px] text-copper">+{extraCount} more</span>
                  )}
                </>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-mist transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              strokeWidth={2}
            />
          </div>
        </Popover.Trigger>

        <AnimatePresence>
          {open && (
            <Popover.Portal forceMount>
              <Popover.Content
                forceMount
                asChild
                align="start"
                sideOffset={8}
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="z-50 overflow-hidden rounded-[14px] border border-deep-line shadow-2xl"
                  style={{ backgroundColor: "#06205B" }}
                >
                  <Command loop className="flex flex-col">
                    <div className="border-b border-deep-line px-4 py-3">
                      <CommandInput
                        placeholder="Search services…"
                        className="w-full bg-transparent text-sm text-ivory placeholder:text-mist/60 outline-none"
                        autoFocus
                      />
                    </div>

                    <CommandList className="services-multiselect-scroll max-h-[320px] overflow-y-auto p-2">
                      <CommandEmpty className="px-3 py-6 text-center text-sm text-mist">
                        No services found.
                      </CommandEmpty>
                      {site.services.map((s) => {
                        const selected = value.includes(s.id);
                        return (
                          <CommandItem
                            key={s.id}
                            value={s.name}
                            onSelect={() => toggle(s.id)}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ivory outline-none transition-colors data-[selected=true]:bg-[rgba(255,253,248,0.06)]"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                                selected ? "border-copper bg-copper" : "border-deep-line"
                              }`}
                            >
                              {selected && <Check className="h-3 w-3 text-pounamu-night" strokeWidth={3} />}
                            </span>
                            <span className="font-mono-label shrink-0 text-mist">{s.index}</span>
                            <span className="truncate">{s.name}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandList>

                    <div className="flex items-center justify-between border-t border-deep-line px-4 py-3">
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-sm font-medium text-mist transition-colors hover:text-ivory focus-ring"
                      >
                        Clear all
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="btn-gradient rounded-full px-5 py-2 text-sm font-semibold text-pounamu-night focus-ring"
                      >
                        Done
                      </button>
                    </div>
                  </Command>
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          )}
        </AnimatePresence>
      </Popover.Root>
      {error && <p className="mt-1.5 text-[13px] text-[#E5484D]">{error}</p>}
    </div>
  );
}
