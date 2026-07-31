'use client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { DONATION_LINKS } from '@/config/site';
import { track, EVENTS } from '@/lib/analytics';

export default function DonationButton() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="shadow"
          className="font-bold bg-[#FFDD00] text-black shadow-[0_4px_14px_0_rgba(255,221,0,0.39)]"
          startContent={<span className="text-xl">☕</span>}
        >
          Buy me a coffee
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Opciones de donación"
        onAction={(key) => track(EVENTS.DONATION_CLICK, { provider: key })}
      >
        <DropdownItem
          key="buymeacoffee"
          href={DONATION_LINKS.buymeacoffee}
          target="_blank"
          startContent={<span className="text-lg">☕</span>}
        >
          Buy Me a Coffee
        </DropdownItem>
        <DropdownItem
          key="paypal"
          href={DONATION_LINKS.paypal}
          target="_blank"
          startContent={<span className="text-lg">💳</span>}
        >
          PayPal
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
