const flow = {
  trigger: { outputs: [ { stepIndex: 1 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 1 */
    { type: 'conditions', outputs: [                                     /* 2 */
      { reason: 'condition-true', stepIndex: 3 } 
    ] },
    { type: 'abc', outputs: [] },                                        /* 3 */
  ]
}

module.exports.flow = flow

module.exports.cases = [
  {
    executedSteps: [],
    result: {
      stepsToExecute: [
        0, 1, 2, 'trigger'
      ],
      errors: {
        hasEmptyConditions: false,
        isCircular: false
      },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, pass: false }
    ],
    result: {
      stepsToExecute: [
        0, 1, 2, 'trigger'
      ],
      errors: {
        hasEmptyConditions: false,
        isCircular: false
      },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, pass: true }
    ],
    result: {
      stepsToExecute: [
        0, 1, 2, 3, 'trigger'
      ],
      errors: {
        hasEmptyConditions: false,
        isCircular: false
      },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, pass: true },
      { stepIndex: 2, pass: true },
      { stepIndex: 2, pass: true },
      { stepIndex: 2, pass: true },
      { stepIndex: 2, pass: true },
      { stepIndex: 2, pass: true }
    ],
    result: {
      stepsToExecute: [
        0, 1, 2, 3, 'trigger'
      ],
      errors: {
        hasEmptyConditions: false,
        isCircular: false
      },
      completed: false
    }
  },
]