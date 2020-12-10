const flow = {
  trigger: { outputs: [ { stepIndex: 1 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 1 */
    { type: 'conditions', outputs: [                                     /* 2 */
      { reason: 'condition-false', stepIndex: 3 },
      { reason: 'condition-true', stepIndex: 4 } 
    ] },
    { type: 'abc', outputs: [] },                                        /* 3 */
    { type: 'abc', outputs: [] }                                         /* 4 */
  ]
}

module.exports.flow = flow

module.exports.cases = [
  {
    executedSteps: [],
    result: {
      stepsToExecute: [
        0,1,2,'trigger'
      ],
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      {}
    ],
    result: {
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      {}, {}, {}
    ],
    result: {
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      {stepIndex: 2, pass: true}
    ],
    result: {
      stepsToExecute: [
        0,1,2,4,'trigger'
      ],
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      {stepIndex: 2, pass: false}
    ],
    result: {
      stepsToExecute: [
        0,1,2,3,'trigger'
      ],
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      {stepIndex: 0},
      {stepIndex: 1},
      {stepIndex: 2, pass: false},
      {stepIndex: 3},
      {stepIndex: 'trigger'}
    ],
    result: {
      stepsToExecute: [
        0,1,2,3,'trigger'
      ],
      errors: { isCircular: false },
      completed: true
    }
  },

  {
    executedSteps: [
      {stepIndex: 0},
      {stepIndex: 0}, // 1 removed on purpose
      {stepIndex: 2, pass: false},
      {stepIndex: 3},
      {stepIndex: 'trigger'}
    ],
    result: {
      stepsToExecute: [
        0,1,2,3,'trigger'
      ],
      errors: { isCircular: false },
      completed: false
    }
  }
]