export const INITIAL_COURSES = [
  {
    id: 1, name: 'React Advanced Patterns', progress: 72, total: 48, done: 35, cat: 'Development',
    videos: [
      { title: 'React Design Patterns', url: 'https://www.youtube.com/watch?v=MdvzlDIdQ0o', duration: '32:15' },
      { title: 'Advanced React Hooks', url: 'https://www.youtube.com/watch?v=0c6znExIqRw', duration: '24:40' },
      { title: 'React Performance Optimization', url: 'https://www.youtube.com/watch?v=CaShN564gMY', duration: '18:22' },
    ],
    resources: [
      { title: 'React Official Docs', url: 'https://react.dev' },
      { title: 'Patterns.dev – React', url: 'https://www.patterns.dev/react' },
    ],
  },
  {
    id: 2, name: 'Data Science Fundamentals', progress: 45, total: 60, done: 27, cat: 'Data',
    videos: [
      { title: 'Data Science Full Course', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', duration: '45:10' },
      { title: 'Pandas Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', duration: '28:33' },
      { title: 'Data Visualization with Python', url: 'https://www.youtube.com/watch?v=a9UrKTVEeZA', duration: '35:50' },
    ],
    resources: [
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
      { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
    ],
  },
  {
    id: 3, name: 'UI/UX Design Principles', progress: 90, total: 30, done: 27, cat: 'Design',
    videos: [
      { title: 'UI/UX Design Tutorial', url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', duration: '22:45' },
      { title: 'Figma for Beginners', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', duration: '40:12' },
      { title: 'Color Theory for Designers', url: 'https://www.youtube.com/watch?v=YeI6Wqn4I78', duration: '15:30' },
    ],
    resources: [
      { title: 'Laws of UX', url: 'https://lawsofux.com' },
      { title: 'Dribbble Inspiration', url: 'https://dribbble.com' },
    ],
  },
  {
    id: 4, name: 'Machine Learning Basics', progress: 20, total: 80, done: 16, cat: 'AI',
    videos: [
      { title: 'Machine Learning Crash Course', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', duration: '52:30' },
      { title: 'Neural Networks Explained', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: '19:13' },
      { title: 'TensorFlow in 10 Minutes', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk', duration: '10:22' },
    ],
    resources: [
      { title: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' },
      { title: 'fast.ai', url: 'https://www.fast.ai' },
    ],
  },
]

export const FLASHCARDS = [
  {
    q: 'What is a closure in JavaScript?',
    a: 'A function that retains access to its outer lexical scope even after the outer function has returned.',
  },
  {
    q: "Explain React's virtual DOM",
    a: 'A lightweight in-memory copy of the real DOM used to efficiently compute minimal updates before committing them to the actual DOM.',
  },
  {
    q: 'What is O(n) time complexity?',
    a: 'Linear time complexity — the execution time grows proportionally with the size of the input.',
  },
  {
    q: 'What is the difference between == and === in JavaScript?',
    a: '== compares values with type coercion; === compares values AND types without coercion (strict equality).',
  },
  {
    q: 'What is a RESTful API?',
    a: 'An API that follows REST architectural constraints: stateless, uniform interface, cacheable, client-server separation.',
  },
]

export const COURSE_CATEGORIES = ['Development', 'Data', 'Design', 'AI', 'Business', 'Language']

export const CAT_BADGE = {
  Development: 'badge-cyan',
  Data:        'badge-amber',
  Design:      'badge-pink',
  AI:          'badge-purple',
  Business:    'badge-green',
  Language:    'badge-orange',
}
