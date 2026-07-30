'use client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';

export default function DonationButton() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color="warning"
          variant="shadow"
          className="font-bold text-white bg-[#FFDD00] text-black shadow-[0_4px_14px_0_rgba(255,221,0,0.39)]"
          startContent={<span className="text-xl">☕</span>}
        >
          Apoyar el proyecto
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Opciones de donación">
        <DropdownItem 
          key="buymeacoffee" 
          href="https://buymeacoffee.com/brianbent"
          target="_blank"
          startContent={<span className="text-lg">☕</span>}
        >
          Buy Me a Coffee
        </DropdownItem>
        <DropdownItem 
          key="paypal" 
          href="https://www.paypal.com/donate/?hosted_button_id=LRFX7GE2YG3JU"
          target="_blank"
          startContent={<span className="text-lg">💳</span>}
        >
          PayPal
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
