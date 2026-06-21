/**
 * Course-specific flashcards
 * Key matches course id (number) or course name keyword
 */
export const COURSE_FLASHCARDS = {
  1: [ // React Advanced Patterns
    { id: 'r1', q: 'What is the Compound Component pattern?',       a: 'Components that share state implicitly via React Context, used together to form a feature (e.g. <Select><Option/>).' },
    { id: 'r2', q: 'What is the Render Props pattern?',             a: 'A technique where a component accepts a function as a prop and calls it to determine what to render, enabling logic sharing.' },
    { id: 'r3', q: 'When should you use useCallback?',              a: 'When passing a callback to an optimized child component that relies on referential equality to prevent re-renders.' },
    { id: 'r4', q: 'What does React.memo do?',                      a: 'Wraps a functional component to memoize its output — it only re-renders if props change (shallow comparison).' },
    { id: 'r5', q: 'What is the difference between useMemo and useCallback?', a: 'useMemo memoizes a computed value; useCallback memoizes a function reference.' },
    { id: 'r6', q: 'What is the Context Selector pattern?',         a: 'Using multiple contexts or selectors to prevent components from re-rendering when only an unrelated part of context changes.' },
    { id: 'r7', q: 'Explain code splitting with React.lazy',        a: 'React.lazy() lets you render a dynamic import as a regular component. It works with Suspense to show a fallback while loading.' },
  ],
  2: [ // Data Science Fundamentals
    { id: 'd1', q: 'What is the difference between supervised and unsupervised learning?', a: 'Supervised: models trained on labeled data. Unsupervised: models find patterns in unlabeled data (clustering, etc.).' },
    { id: 'd2', q: 'What is overfitting?',                         a: 'When a model learns training data too well, including noise, and performs poorly on new unseen data.' },
    { id: 'd3', q: 'What is cross-validation?',                    a: 'A technique to evaluate model performance by splitting data into k folds and training/testing k times.' },
    { id: 'd4', q: 'What is the bias-variance tradeoff?',          a: 'High bias = underfitting (too simple). High variance = overfitting (too complex). Goal: minimize both.' },
    { id: 'd5', q: 'What does pandas DataFrame.groupby() do?',     a: 'Groups rows by one or more columns, then allows aggregate functions (sum, mean, count) on each group.' },
    { id: 'd6', q: 'What is feature engineering?',                 a: 'The process of creating, transforming, or selecting features to improve model performance.' },
  ],
  3: [ // UI/UX Design
    { id: 'u1', q: 'What are the 10 Nielsen\'s Heuristics?',       a: 'Visibility of status, Match with real world, User control, Consistency, Error prevention, Recognition, Flexibility, Minimalism, Help users recover, Documentation.' },
    { id: 'u2', q: 'What is the difference between UX and UI?',    a: 'UX (User Experience) focuses on the overall feel and usability. UI (User Interface) focuses on the visual design and interactive elements.' },
    { id: 'u3', q: 'What is the Fitts\'s Law?',                    a: 'The time to reach a target is a function of the distance to and size of the target. Larger, closer targets are faster to click.' },
    { id: 'u4', q: 'What is a design system?',                     a: 'A collection of reusable components, guidelines, and standards that provide a unified language for designing products.' },
    { id: 'u5', q: 'What is progressive disclosure?',              a: 'Showing only essential info first, revealing more details progressively to reduce cognitive load.' },
  ],
  4: [ // Machine Learning Basics
    { id: 'm1', q: 'What is a neural network?',                    a: 'A computational model inspired by the brain, consisting of layers of interconnected nodes (neurons) that learn patterns from data.' },
    { id: 'm2', q: 'What is gradient descent?',                    a: 'An optimization algorithm that iteratively adjusts model parameters in the direction of steepest loss reduction.' },
    { id: 'm3', q: 'What is a loss function?',                     a: 'A function measuring the difference between predicted and actual values. The model tries to minimize it during training.' },
    { id: 'm4', q: 'What is backpropagation?',                     a: 'Algorithm that computes gradients of the loss with respect to each parameter by propagating errors backward through the network.' },
    { id: 'm5', q: 'What is regularization?',                      a: 'Techniques (L1/L2/dropout) that add constraints or noise to prevent overfitting by discouraging overly complex models.' },
    { id: 'm6', q: 'What is transfer learning?',                   a: 'Using a pre-trained model on a new task, typically fine-tuning the final layers on the new dataset.' },
  ],
}

export const DEFAULT_FLASHCARDS = [
  { id: 'g1', q: 'What is a REST API?',       a: 'An architectural style using HTTP methods (GET, POST, PUT, DELETE) on stateless endpoints to transfer data, usually as JSON.' },
  { id: 'g2', q: 'What is version control?',  a: 'A system that records changes to files over time so you can recall specific versions later (e.g. Git).' },
  { id: 'g3', q: 'What is agile methodology?',a: 'An iterative approach to software development emphasizing collaboration, customer feedback, and rapid delivery of small increments.' },
]
