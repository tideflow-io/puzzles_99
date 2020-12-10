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
      { stepIndex: 2, pass: true }
    ],
    result: {
      errors: { isCircular: true }
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, pass: false }
    ],
    result: {
      errors: { isCircular: true }
    }
  },

  {
    executedSteps: [
    ],
    result: {
      errors: { isCircular: true }
    }
  },
]