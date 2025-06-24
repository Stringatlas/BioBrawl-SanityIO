import {defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: rule => rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: rule => rule.required(),
    },
  ],
})