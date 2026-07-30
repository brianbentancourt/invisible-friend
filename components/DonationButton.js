'use client';

import { Button } from '@nextui-org/react';

export default function DonationButton() {
  return (
    <Button
      as="a"
      href="https://www.paypal.com/donate/?hosted_button_id=LRFX7GE2YG3JU"
      target="_blank"
      rel="noopener noreferrer"
      color="warning"
      variant="shadow"
      className="font-bold text-white bg-[#FFDD00] text-black shadow-[0_4px_14px_0_rgba(255,221,0,0.39)]"
      startContent={<span className="text-xl">☕</span>}
    >
      Invítame un café
    </Button>
  );
}
