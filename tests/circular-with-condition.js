const flow = {
  trigger: { outputs: [ { stepIndex: 1 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 1 */
    { type: 'conditions', outputs: [                                     /* 2 */
      { reason: 'condition-false', stepIndex: 3 },
      { reason: 'condition-true', stepIndex: 4 } 
    ] },
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 0 } ] },      /* 3 */
    { type: 'abc', outputs: [] }                                         /* 4 */
  ]
}

module.exports.flow = flow

module.exports.cases = [
  {
    executedSteps: [
      { stepIndex: 2, result: { pass: true } }
    ],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, result: { pass: false } }
    ],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },

  {
    executedSteps: [],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },
]