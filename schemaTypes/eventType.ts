import {defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'eventID', title: 'Event ID', type: 'number', validation: rule => rule.required() },
    {
        name: 'active',
        title: 'Active Event',
        type: 'boolean',
        initialValue: false,
        description: 'Mark this as the currently active event. Only one event can be active at a time.',
        validation: Rule =>
          Rule.custom(async (active, context) => {
            if (!active) return true;
            const {document, getClient} = context;
            const client = getClient({apiVersion: '2024-01-01'});
            // Handle both draft and published IDs
            const id = document?._id;
            const publishedId = id?.replace(/^drafts\./, '');
            const query = `*[_type == "event" && active == true && !(_id in [$draftId, $publishedId])][0]{_id}`;
            const params = {
              draftId: id,
              publishedId: publishedId,
            };
            const existing = await client.fetch(query, params);
            return existing
              ? 'Another event is already marked as active.'
              : true;
          }),
    },
    {
      name: 'live',
      title: 'Event Live',
      type: 'boolean',
      initialValue: false,
      description: 'Shows the competition bracket on the homepage'
    },
    { name: 'year', title: 'Year', type: 'number', validation: rule => rule.required() },
    { name: 'name', title: 'Name', type: 'string', validation: rule => rule.required() },
    { name: 'date', title: 'Date', type: 'string', validation: rule => rule.required() },
    { name: 'time', title: 'Time', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'rules', title: 'Rules (PDF Link)', type: 'string' },
    {
        name: 'rulesWorkshop',
        title: 'Rules Workshop',
        type: 'object',
        fields: [
            { name: 'date', title: 'Workshop Date', type: 'string' }
        ]
    },
    {
        name: 'divisions',
        title: 'Divisions',
        type: 'array',
        of: [
            {
            name: 'division',
            type: 'object',
            fields: [
                {
                name: 'name',
                title: 'Division Name',
                type: 'string',
                validation: Rule => Rule.required(),
                },

                {
                name: 'prizes',
                title: 'Prizes',
                type: 'array',
                of: [
                    {
                    name: 'prize',
                    type: 'object',
                    fields: [
                        {
                        name: 'place',
                        title: 'Place',
                        type: 'number',
                        validation: Rule => Rule.required(),
                        },
                        {
                        name: 'amount',
                        title: 'Prize',
                        type: 'string',
                        },
                    ],
                    },
                ],
                },

                {
                name: 'winners',
                title: 'Winners',
                type: 'array',
                of: [
                    {
                    name: 'winner',
                    type: 'object',
                    fields: [
                        {
                        name: 'place',
                        title: 'Place',
                        type: 'number',
                        validation: Rule => Rule.required(),
                        },
                        {
                        name: 'team',
                        title: 'Team',
                        type: 'string',
                        validation: Rule => Rule.required(),
                        },
                    ],
                    },
                ],
                },
            ],
            },
        ],
    },
    {
      name: 'prizes',
      title: 'Prizes',
      type: 'object',
      fields: [
        { name: 'first', title: 'First Place Prize', type: 'string' },
        { name: 'second', title: 'Second Place Prize', type: 'string' },
        { name: 'third', title: 'Third Place Prize', type: 'string' },
        { name: 'fourth', title: 'Fourth Place Prize', type: 'string' },
        { name: 'fifth', title: 'Fifth Place Prize', type: 'string' },
      ]
    },
    { name: 'registrationFee', title: 'Registration Fee', type: 'number' },
    { name: 'teamSize', title: 'Team Size', type: 'string' },
    { name: 'grades', title: 'Grades', type: 'string' },
    {
      name: 'postEventData',
      title: 'Post Event Data',
      type: 'object',
      fields: [
        { name: 'participants', title: 'Participants', type: 'number' },
        { name: 'teams', title: 'Teams', type: 'number' },
      ]
    },
    {
      name: 'registration',
      title: 'Registration',
      type: 'object',
      fields: [
        { name: 'opens', title: 'Opens', type: 'string' },
        { name: 'isOpen', title: 'Is Open', type: 'boolean' },
        { name: 'closes', title: 'Closes', type: 'string' },
        { name: 'link', title: 'Registration Link', type: 'url' },
        { name: 'alternativeLink', title: 'Alternative Link', type: 'url' },
      ]
    },
    {
      name: 'mock',
      title: 'Mock',
      type: 'object',
      fields: [
        { name: 'date', title: 'Mock Date', type: 'string' }
      ]
    },
    {
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      description: 'Dated items shown on the home page, in this order (drag to reorder). Type the time zone in "When". When empty, the site shows Date, Time, Rules Workshop, Mock and Registration Closes instead.',
      of: [
        {
          name: 'scheduleItem',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. "Buzzer Challenge"',
              validation: Rule => Rule.required(),
            },
            {
              name: 'when',
              title: 'When',
              type: 'string',
              description: 'Free text including the time zone, e.g. "Jan 16, 2027, 8 AM–5 PM PT"',
              validation: Rule => Rule.required(),
            },
            {
              name: 'note',
              title: 'Note',
              type: 'string',
              description: 'Optional short note, e.g. "optional" or "registered teams only"',
            },
          ],
          preview: {
            select: {title: 'label', subtitle: 'when'},
          },
        },
      ],
    },
    { name: 'contact', title: 'Contact', type: 'string' },
    {
      name: 'results',
      title: 'Results',
      type: 'object',
      fields: [
        { name: 'eliminationBracket', title: 'Elimination Bracket Link', type: 'url' },
        {
          name: 'winners',
          title: 'Winners',
          type: 'object',
          fields: [
            { name: 'first', title: 'First Place Team', type: 'string' },
            { name: 'second', title: 'Second Place Team', type: 'string' },
            { name: 'third', title: 'Third Place Team', type: 'string' },
          ]
        },
        { name: 'description', title: 'Results Description', type: 'text' }
      ]
    },
  ]
});