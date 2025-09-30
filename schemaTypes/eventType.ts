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