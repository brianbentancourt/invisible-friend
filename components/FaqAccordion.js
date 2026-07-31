'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';

export default function FaqAccordion({ faqs = [] }) {
    if (!faqs.length) return null;

    return (
        <Accordion variant="splitted" className="px-0">
            {faqs.map((faq, index) => (
                <AccordionItem
                    key={index}
                    aria-label={faq.q}
                    title={<span className="font-semibold text-left">{faq.q}</span>}
                    classNames={{
                        content: 'text-default-500 leading-relaxed pb-4',
                    }}
                >
                    {faq.a}
                </AccordionItem>
            ))}
        </Accordion>
    );
}
