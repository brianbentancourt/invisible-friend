const CTA = {
    title: 'Organizing the draw this year?',
    desc: 'Add your list, set the exclusions and let everyone get their own secret link. Free, and no sign-up to get started.',
    label: 'Create my free draw',
};

export const pagesEn = [
    {
        key: 'pricing',
        type: 'pricing',
        slug: 'pricing',
        priority: 0.9,
        changeFrequency: 'monthly',
        title: 'Pricing - Secret Santa generator',
        h1: 'Pricing',
        description:
            'Run your Secret Santa free for up to 15 participants. Premium and Business plans add unlimited participants, no ads and automatic reminders.',
        keywords: ['secret santa price', 'secret santa premium', 'secret santa for business'],
        intro:
            'The tool is free for most draws. Paid plans exist for large groups and for whoever ends up organizing the company exchange.',
        showPricing: true,
        faqs: [
            {
                q: 'Is this a subscription?',
                a: 'No. It is a one-off payment per season: you pay once and use every feature during that period, with no automatic renewals and no surprise charges.',
            },
            {
                q: 'Which payment methods do you accept?',
                a: 'You can choose between MercadoPago and PayPal. MercadoPago accepts credit and debit cards, bank transfers and account balance depending on the country. PayPal is available in 200+ countries and lets you pay with an international card, whether or not you have a PayPal account.',
            },
            {
                q: 'Can I pay from outside Latin America?',
                a: 'Yes. Outside Latin America, PayPal is the easier option: you are charged in US dollars (USD) and it works with cards from almost any country. With MercadoPago the price is charged in Uruguayan pesos because our account is Uruguayan, and your bank handles the conversion automatically.',
            },
            {
                q: 'What if I already ran the draw and then want Premium?',
                a: 'You can upgrade at any time. New features apply to your current draw and to any draw you run afterwards; links already sent keep working exactly the same.',
            },
            {
                q: 'Do you offer refunds?',
                a: 'If the service did not work as you expected, write to us within 14 days and we will refund you. We would rather do that than keep money from someone it did not help.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'faq',
        type: 'faq',
        slug: 'faq',
        priority: 0.8,
        changeFrequency: 'monthly',
        title: 'Secret Santa FAQ - How the online draw works',
        h1: 'Frequently asked questions',
        description:
            'How the online Secret Santa draw works: exclusions, notifications, privacy, free plan limits and what to do if someone loses their link.',
        keywords: ['how does secret santa work', 'secret santa questions', 'secret santa online draw'],
        intro: 'These are the questions that reach our inbox most often. If yours is not here, write to us and we will add it.',
        faqs: [
            {
                q: 'How does the draw work?',
                a: 'You add the participants with their email or phone number, set exclusions if needed, and press "Run draw". The system generates a valid random assignment and sends each person a secret link where they — and only they — see who they are gifting.',
            },
            {
                q: 'Can the organizer take part without cheating?',
                a: 'Yes. Full results are never displayed on screen. As the organizer you can see whether notifications went out, but not anyone else\'s match. You get your own secret link just like everybody else.',
            },
            {
                q: 'How many people can join?',
                a: 'The free plan allows up to 15 participants per draw. With Premium there is no limit: we have seen company draws with more than 100 people.',
            },
            {
                q: 'What are exclusion rules?',
                a: 'They are restrictions of the type "this person cannot gift that one". They are mostly used so couples are not matched together, to separate siblings, or to avoid repeating last year\'s assignment. You can add as many as you like, as long as at least one valid combination remains.',
            },
            {
                q: 'What if the exclusions make the draw impossible?',
                a: 'The algorithm retries hundreds of times looking for a valid combination. If none exists (for example, three people who cannot gift each other), it returns an error so you can relax one of the rules.',
            },
            {
                q: 'How do participants find out?',
                a: 'Automatically by email, and by WhatsApp if you added their phone number with the country code. The results table also gives you a button to share each person\'s link manually through any channel.',
            },
            {
                q: 'What if someone never got the message?',
                a: 'You will see a red cross next to that person and a button to retry the delivery. If it keeps failing (a typo in the email, a phone number without country code), you can copy their secret link and send it yourself.',
            },
            {
                q: 'Can I re-run the draw if I made a mistake?',
                a: 'Yes. Press "New draw" and a fresh assignment is generated while keeping your participant list. Keep in mind the previous links become obsolete, so tell the group before re-running it.',
            },
            {
                q: 'Do the links expire?',
                a: 'Links stay active as long as the draw exists. They are long random addresses, impossible to guess, but anyone who receives someone else\'s link would see their match: that is why we ask people not to forward them.',
            },
            {
                q: 'Do you store my friends\' data?',
                a: 'We store names, emails and phone numbers so we can send the notifications and keep the secret link working. We do not sell them, we do not market to them, and we delete them if you ask us to.',
            },
            {
                q: 'Does it work for the office exchange?',
                a: 'Yes, it is one of the most common uses. For large teams the Premium or Business plan makes sense: unlimited participants, reminders before the event and a dashboard with the delivery status of every person.',
            },
            {
                q: 'Does it work on mobile?',
                a: 'Yes, with nothing to install. Both the organizer dashboard and the reveal page work in any phone browser.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'generator',
        type: 'landing',
        slug: 'secret-santa-generator',
        priority: 0.9,
        changeFrequency: 'monthly',
        title: 'Secret Santa Generator - Free online draw with exclusions',
        h1: 'Secret Santa generator',
        description:
            'Draw names for Secret Santa online, for free. Add participants, set who cannot be matched with whom, and notify everyone by WhatsApp or email in seconds.',
        keywords: ['secret santa generator', 'secret santa name picker', 'draw names online', 'secret santa online'],
        intro:
            'Secret Santa, Amigo Invisible, Amigo Secreto or gift exchange: the name changes by country, but the problem is always the same. Someone has to run the draw, and that person ends up knowing more than they should.',
        sections: [
            {
                h2: 'Drawing names by hand has three problems',
                p: [
                    'The first is logistics: everyone has to be in the same place at the same time, which with large families or work teams almost never happens.',
                    'The second is that whoever hands out the slips usually ends up excluded from the draw, or accidentally sees a match.',
                    'The third is repetition: with no record of previous years, it is common for the same person to draw the same name twice in a row.',
                ],
            },
            {
                h2: 'How an online draw fixes it',
                ul: [
                    'Everyone gets a private link: nobody sees the full list, not even the organizer.',
                    'Exclusions are set once and the algorithm respects them every time.',
                    'Nobody needs to be in the same room: notifications go out by email and WhatsApp.',
                    'Each person\'s wishlist travels with their link, so gifts land better.',
                ],
            },
            {
                h2: 'How many people do I need',
                p: [
                    'It works from three people, but it gets interesting from five or six upwards: the more participants, the less predictable the result.',
                    'In groups under four with couple exclusions, the draw can become mathematically impossible. When that happens the tool tells you instead of handing back an invalid assignment.',
                ],
            },
            {
                h2: 'When to run it',
                p: [
                    'The practical advice is to draw names two to three weeks before the exchange. That leaves time to shop without panic and keeps people from forgetting who they got.',
                    'If it is a work group, agree the budget at the same time as the draw: that is the number one source of awkwardness when someone spends far more than everyone else.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Is Secret Santa the same as Amigo Invisible?',
                a: 'Yes. It is the same game with a different name depending on the country: Amigo Invisible in Spain, Amigo Secreto across much of Latin America, Amigo Oculto in Brazil and Secret Santa in English. The tool works the same for all of them.',
            },
            {
                q: 'Can we do the draw if we live in different cities?',
                a: 'Yes, that is exactly the point. Nobody needs to be present: each person gets their link by email or WhatsApp and opens it whenever they want.',
            },
            {
                q: 'Is it free?',
                a: 'Yes, for up to 15 participants, notifications included and with no limit on how many draws you run.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'work',
        type: 'landing',
        slug: 'secret-santa-for-work',
        priority: 0.8,
        changeFrequency: 'monthly',
        title: 'Secret Santa for work - Organize the office gift exchange',
        h1: 'Secret Santa for the office',
        description:
            'Run your company Secret Santa without spreadsheets or email chains. Unlimited participants, team exclusions, reminders and delivery tracking.',
        keywords: ['secret santa for work', 'office secret santa', 'company gift exchange', 'secret santa hr'],
        intro:
            'The end-of-year exchange at work usually lands on the same person in HR, who ends up managing a spreadsheet, an email chain and fifteen messages asking "who did I get again?".',
        sections: [
            {
                h2: 'What usually goes wrong in an office draw',
                ul: [
                    'The spreadsheet circulates by email and someone sees everyone else\'s matches.',
                    'People join after the draw and the whole thing has to be redone.',
                    'Nobody remembers the agreed budget and gifts end up wildly uneven.',
                    'Whoever organizes cannot take part without knowing their own match.',
                    'People forget, and someone has to chase them the week of the event.',
                ],
            },
            {
                h2: 'How to set it up in 10 minutes',
                ol: [
                    'Collect the names and work emails of the team.',
                    'Add them to the dashboard: you can paste the list in batches, it saves itself.',
                    'Set the exclusions that make sense (for example, so two people from the same small team are not matched).',
                    'Set the exchange date and the suggested budget.',
                    'Run the draw: everyone gets their private link by email.',
                    'Check the delivery panel and resend the link to anyone who missed it.',
                ],
            },
            {
                h2: 'Budget: the detail that prevents most friction',
                p: [
                    'Setting a clear range (a minimum and a maximum) avoids the awkward moment of receiving a gift far more expensive than the one you gave.',
                    'In teams with uneven salaries, keep the budget low. The point of the exchange is the gesture, not the competition.',
                ],
            },
            {
                h2: 'What the Business plan adds',
                ul: [
                    'Unlimited participants, for teams of any size.',
                    'Your company logo and colors on the page participants see.',
                    'Several draws in parallel, useful when each office or department runs its own.',
                    'Automatic reminders before the exchange date.',
                    'A dashboard with per-person delivery status.',
                    'No ads in the experience your team sees.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Does it work for remote or hybrid teams?',
                a: 'Yes. Since everything runs on email and individual links, nobody has to be in the office. Distributed teams usually pair it with digital gifts or home delivery.',
            },
            {
                q: 'Can I add people after the draw?',
                a: 'You would have to re-run the draw to include them, which invalidates the previous links. The recommendation is to close sign-ups a few days ahead and only then run the draw.',
            },
            {
                q: 'Is employee data safe?',
                a: 'We only use name, email and phone number to send the notifications for that draw. Nothing is shared with third parties or used for advertising, and it is deleted on request.',
            },
        ],
        cta: {
            title: 'Set up your team exchange',
            desc: 'Start free and move to the Business plan if you need unlimited participants, reminders and your company branding.',
            label: 'Create the office draw',
        },
    },
    {
        key: 'gift-ideas',
        type: 'article',
        slug: 'secret-santa-gift-ideas',
        priority: 0.7,
        changeFrequency: 'yearly',
        title: 'Cheap Secret Santa gift ideas that actually work',
        h1: 'Cheap Secret Santa gift ideas',
        description:
            'Over 40 Secret Santa gift ideas on a small budget, sorted by who you drew: coworkers, family, teenagers and handmade gifts.',
        keywords: ['secret santa gift ideas', 'cheap secret santa gifts', 'what to buy secret santa', 'budget christmas gifts'],
        intro:
            'The hard part of Secret Santa is rarely the budget: it is drawing someone you barely know. These ideas are sorted by situation, which is how people actually shop.',
        sections: [
            {
                h2: 'If you barely know the person',
                p: ['The rule is simple: pick something consumable or genuinely everyday. Nobody has to pretend they loved it, and it does not take up space at home.'],
                ul: [
                    'Specialty coffee or a tea selection',
                    'A good chocolate bar or local sweets',
                    'A small indoor plant, like a succulent or a pothos',
                    'A plain mug (skip the joke slogans if you are not close)',
                    'Scented candles or a small diffuser',
                    'A decent notebook and a pen that writes well',
                ],
            },
            {
                h2: 'For the office exchange',
                ul: [
                    'A phone or laptop stand',
                    'Simple earbuds or a cable organizer',
                    'A reusable insulated bottle',
                    'A small desk game or a puzzle',
                    'A voucher for the coffee shop near the office',
                    'A nice desk calendar',
                ],
            },
            {
                h2: 'For family',
                ul: [
                    'A printed photo of the group in a frame',
                    'A short board game, the kind that plays in half an hour',
                    'Gloves, a scarf or thermal socks if it is winter',
                    'A cookbook or a specific kitchen tool they are missing',
                    'An album or a USB drive with family photos and videos',
                ],
            },
            {
                h2: 'For teenagers',
                ul: [
                    'Phone cases or accessories',
                    'A small power bank',
                    'Stickers, posters or merch from something they follow',
                    'A one-month subscription to a music or streaming service',
                    'Art supplies or stationery if they draw',
                ],
            },
            {
                h2: 'Handmade gifts that land well',
                p: ['A homemade gift works when it clearly took time rather than improvisation. These are the ones people actually appreciate:'],
                ul: [
                    'Cookies or jam in a decorated jar',
                    'A playlist with a note explaining why you picked each song',
                    'A voucher for something concrete: a cooked dinner, help moving, watering their plants',
                    'A printed, framed photo of a shared moment',
                ],
            },
            {
                h2: 'What to avoid',
                ul: [
                    'Clothing in a specific size, unless you are certain',
                    'Perfume: taste is far too personal',
                    'Gifts referencing an inside joke the person may not share',
                    'Anything that pressures them to reciprocate with something pricier',
                    'Large ornaments: they take up space and are hard to throw out guilt-free',
                ],
            },
            {
                h2: 'The trick that avoids all of this',
                p: [
                    'If every participant writes two or three things they would like when they sign up, the problem disappears. In our draw that wishlist travels with the secret link: whoever drew you sees straight away what would actually be useful.',
                ],
            },
        ],
        faqs: [
            {
                q: 'How much do people usually spend on Secret Santa?',
                a: 'It depends on the group, but what matters is that the range is agreed before the draw and is the same for everyone. A low, explicit budget works better than a high, vague one.',
            },
            {
                q: 'Is a gift card acceptable?',
                a: 'It works when you do not know the person, though it reads as less personal. If you go that way, add a handwritten note: it completely changes how it is received.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'rules',
        type: 'article',
        slug: 'secret-santa-rules',
        priority: 0.7,
        changeFrequency: 'yearly',
        title: 'Secret Santa rules: how to organize it properly',
        h1: 'The rules of Secret Santa',
        description:
            'How Secret Santa is played: number of participants, budget, timing, exclusion rules and variants like wishlists, clues and White Elephant.',
        keywords: ['secret santa rules', 'how to play secret santa', 'how to organize secret santa'],
        intro:
            'Secret Santa has very few rules, but agreeing them up front prevents nearly every classic problem: uneven gifts, people forgetting, and draws that have to be re-run.',
        sections: [
            {
                h2: 'The basic rules',
                ol: [
                    'Each participant gives to exactly one person and receives from exactly one person.',
                    'Nobody can draw themselves.',
                    'The assignment stays secret until the day of the exchange.',
                    'Everyone spends within the same budget range.',
                    'Everyone hands over their gift on the agreed date, present or not.',
                ],
            },
            {
                h2: 'How many participants you need',
                p: [
                    'Technically it works from three people, but under five it is easy to deduce who drew you. The sweet spot is between six and thirty participants.',
                    'Above forty it is worth splitting into groups by department or by family: the logistics of one giant draw usually leave someone without a gift.',
                ],
            },
            {
                h2: 'The budget',
                p: [
                    'Agreeing the budget before the draw, not after, is the single rule that prevents the most friction. Ideally set both a minimum and a maximum.',
                    'If the group is economically diverse, a low budget levels everyone. You can also agree on a theme instead of an amount: "handmade", "second-hand", "something edible".',
                ],
            },
            {
                h2: 'Exclusions',
                p: ['An exclusion is a rule of the type "A cannot gift B". The most common ones are:'],
                ul: [
                    'Couples who do not want to draw each other, because they exchange gifts separately.',
                    'Siblings or immediate family, so the draw actually mixes people up.',
                    'Repeats from last year.',
                    'People who work side by side daily, in large office draws.',
                ],
                p2: [
                    'Do not overdo it: the more exclusions, the fewer possible combinations. Add so many that no valid assignment remains and the draw becomes impossible, forcing you to relax one.',
                ],
            },
            {
                h2: 'Timing that works',
                ol: [
                    'Four weeks out: close the participant list.',
                    'Three weeks out: run the draw and agree the budget.',
                    'One week out: send a reminder to the group.',
                    'The day itself: exchange gifts, ideally with everyone present.',
                ],
            },
            {
                h2: 'Known variants',
                ul: [
                    'With clues: each participant writes three hints about themselves, read aloud before revealing who they are.',
                    'With wishlists: everyone notes two or three things they would like. This is the variant that most improves satisfaction with the gift.',
                    'With stealing (White Elephant): gifts have no assigned recipient and, in turns, each person can open a new one or steal someone else\'s. It is a different game and is best not mixed with classic Secret Santa.',
                    'Themed: every gift must meet a condition, such as handmade, second-hand or edible.',
                ],
            },
            {
                h2: 'What to do if someone drops out',
                p: [
                    'If they drop out before the draw, remove them from the list and nothing happens. If they drop out afterwards, the cleanest fix is re-running the whole draw and telling the group, because removing one person breaks the chain of assignments.',
                    'That is why it pays to close the list a few days before drawing, rather than drawing as soon as the first person signs up.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Can Secret Santa be done remotely?',
                a: 'Yes. The draw happens online and the exchange can be handled with home delivery or digital gifts. The only extra rule is to bring the deadline forward to allow for shipping.',
            },
            {
                q: 'Should people find out who gave them the gift?',
                a: 'It depends on the group. The classic version reveals everyone at the end of the exchange; some groups prefer the giver to stay secret forever. Decide it beforehand, not in the moment.',
            },
            {
                q: 'What if someone does not bring a gift?',
                a: 'The organizer usually keeps a spare. Publicly calling out whoever dropped the ball never goes well: handle it privately after the event.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'privacy',
        type: 'legal',
        slug: 'privacy',
        priority: 0.3,
        changeFrequency: 'yearly',
        title: 'Privacy Policy',
        h1: 'Privacy Policy',
        description: 'What data we collect, what we use it for, who we share it with and how you can delete it.',
        intro:
            'This policy explains what data we process when you use the Secret Santa draw and what you can do about it. It is written to be understood, not to cover ourselves.',
        sections: [
            {
                h2: 'Who is responsible',
                p: [
                    'The data controller is Brian Bentancourt, author and operator of this site. You can reach us at brianbentancourt9@gmail.com about anything related to your data.',
                ],
            },
            {
                h2: 'What we collect',
                ul: [
                    'Account data: the email, name and profile picture Google or Facebook gives us when you sign in.',
                    'Participant data you enter: name and, optionally, email, phone number and wishlist.',
                    'Draw data: the generated assignments and the delivery status of each notification.',
                    'Technical data: IP address, browser type and pages visited, through our analytics tool.',
                ],
            },
            {
                h2: 'What we use it for',
                ul: [
                    'Running the draw and sending notifications by email, WhatsApp or SMS.',
                    'Keeping each participant\'s secret link working.',
                    'Processing payment if you buy a paid plan.',
                    'Understanding, in aggregate, how the site is used so we can improve it.',
                ],
                p: [
                    'We do not sell personal data, we do not build advertising profiles, and we do not send marketing messages to the participants you added.',
                ],
            },
            {
                h2: 'Responsibility for third-party data',
                p: [
                    'When you enter other people\'s details, it is on you to make sure they are fine with their email or phone being used for this draw. We process it only for the purposes described above.',
                ],
            },
            {
                h2: 'Who we share it with',
                ul: [
                    'Google Firebase: authentication and database.',
                    'SendGrid: email delivery.',
                    'Twilio: WhatsApp and SMS delivery.',
                    'MercadoPago and PayPal: payment processing. We never store card details.',
                    'Google Analytics and Google AdSense: analytics and advertising, when enabled.',
                    'Vercel: site hosting.',
                ],
            },
            {
                h2: 'Advertising and cookies',
                p: [
                    'We use our own cookies to remember your language and keep you signed in. When advertising is enabled, Google AdSense may use cookies to serve ads; you can manage those preferences from Google\'s ad settings.',
                ],
            },
            {
                h2: 'How long we keep it',
                p: [
                    'Draw data is kept while the account exists, so the links keep working. You can ask us to delete a draw or your entire account at any time.',
                ],
            },
            {
                h2: 'Your rights',
                p: [
                    'You can request access, correction, deletion or portability of your data, and object to its processing, by writing to brianbentancourt9@gmail.com. We reply within 30 days.',
                ],
            },
            {
                h2: 'Children',
                p: [
                    'The service is not aimed at children under 14. If an adult organizes a draw that includes minors, they are responsible for having their guardians\' consent.',
                ],
            },
            {
                h2: 'Changes to this policy',
                p: [
                    'If we change anything meaningful we will update the date on this page. Continued use of the service means you accept the current version.',
                ],
            },
        ],
    },
    {
        key: 'terms',
        type: 'legal',
        slug: 'terms',
        priority: 0.3,
        changeFrequency: 'yearly',
        title: 'Terms and Conditions',
        h1: 'Terms and Conditions',
        description: 'Terms of use for the Secret Santa draw service: accounts, paid plans, limits and responsibilities.',
        intro: 'By using this site you accept these terms. They are deliberately written in plain language.',
        sections: [
            {
                h2: 'The service',
                p: [
                    'We provide a web tool to organize Secret Santa draws: add participants, apply exclusion rules, generate random assignments and notify each person through a private link.',
                ],
            },
            {
                h2: 'Accounts',
                p: [
                    'You can prepare your list without an account. To run the draw you need to sign in with Google or Facebook. You are responsible for activity on your account.',
                ],
            },
            {
                h2: 'Acceptable use',
                ul: [
                    'Do not use the service to send unsolicited messages to people who are not in your draw.',
                    'Do not enter other people\'s data without their knowledge.',
                    'Do not attempt to access other people\'s draws or automate requests against the site.',
                ],
                p: ['We may suspend accounts that break these terms, without a refund where the breach is serious.'],
            },
            {
                h2: 'Plans and payments',
                p: [
                    'The free plan allows draws of up to 15 participants. Paid plans are charged once through MercadoPago (in UYU) or PayPal (in USD), at the user\'s choice, and unlock the features described on the pricing page.',
                    'If the service did not work as expected, you can request a refund within 14 days of payment by writing to our contact email.',
                ],
            },
            {
                h2: 'Availability and limits',
                p: [
                    'The service is provided "as is". We do what is reasonable to keep it running, but we do not guarantee uninterrupted availability or the delivery of every notification: email, WhatsApp and SMS depend on external providers and on correct contact details.',
                    'That is why the dashboard shows the status of each delivery and lets you retry or share the link manually.',
                ],
            },
            {
                h2: 'Liability',
                p: [
                    'We are not liable for indirect damages arising from use of the service, such as an undelivered gift or a match revealed by forwarding a secret link. Our maximum liability is limited to the amount you paid.',
                ],
            },
            {
                h2: 'Intellectual property',
                p: ['The site code, design and copy belong to their author. The data you enter remains yours.'],
            },
            {
                h2: 'Contact',
                p: ['For any question about these terms: brianbentancourt9@gmail.com'],
            },
        ],
    },
];
