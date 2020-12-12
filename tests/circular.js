const flow = {
  trigger: { outputs: [ { stepIndex: 1 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 1 */
    { type: 'abc', outputs: [                                            /* 2 */
      { reason: 'step', stepIndex: 0 },                                  
      { reason: 'step', stepIndex: 3 }
    ] },
    { type: 'abc', outputs: [] },                                        /* 3 */
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
    executedSteps: [
    ],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2 },
      { stepIndex: 3 }
    ],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2, result: { pass: true } },
      { stepIndex: 3 }
    ],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2, result: { pass: false } },
      { stepIndex: 3 }
    ],
    result: {
      errors: { isCircular: true },
      completed: false
    }
  },
]