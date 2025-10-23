import { Node, mergeAttributes } from '@tiptap/core'

export const Video = Node.create({
  name: 'video',

  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      poster: { default: null },
      title: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'tiptap-video-wrapper' },
      [
        'video',
        mergeAttributes(
          {
            class: 'tiptap-video',
            controls: true,
          },
          HTMLAttributes,
        ),
      ],
    ]
  },
})
