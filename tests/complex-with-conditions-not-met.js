const flow = {
  trigger: { outputs: [ { stepIndex: 1 }, { stepIndex: 6 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [                                            /* 1 */
      { reason: 'step', stepIndex: 2 },
      { reason: 'step', stepIndex: 5 }
    ] },
    { type: 'conditions', outputs: [                                     /* 2 */
      { reason: 'condition-false', stepIndex: 3 },
      { reason: 'condition-true', stepIndex: 4 } 
    ] },
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 9 } ] },      /* 3 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 9 } ] },      /* 4 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 9 } ] },      /* 5 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 9 } ] },      /* 6 */
    { type: 'abc', outputs: []},                                         /* 7 */
    { type: 'abc', outputs: []},                                         /* 8 */
    { type: 'conditions', outputs: [                                     /* 9 */
      { reason: 'condition-false', stepIndex: 7 },
      { reason: 'condition-true', stepIndex: 8 } 
    ] }
  ]
}

module.exports.flow = flow

const cases = [
  {
    executedSteps: [],
    result: {
      errors: {
        isCircular: false
      },
      isErrored: true,
      completed: false
    }
  },

  {
    executedSteps: [{}],
    result: {
      errors: { isCircular: false },
      isErrored: true,
      completed: false
    }
  },

  {
    executedSteps: [{},{}],
    result: {
      errors: { isCircular: false },
      isErrored: true,
      completed: false
    }
  },
  
  {
    executedSteps: [
      { stepIndex: 2, result: { pass: true } },
      { stepIndex: 9, result: { pass: true } }
    ],
    result: {
      errors: {
        isCircular: false,
        conditionsNotMet: true
      },
      isErrored: true,
      completed: false
    }
  },
  
  {
    executedSteps: [
      { stepIndex: 2, result: { pass: true } }
    ],
    result: {
      errors: {
        isCircular: false
      },
      isErrored: true,
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, result: { pass: true } },
      { stepIndex: 9, result: { pass: true } }
    ],
    result: {
      errors: { isCircular: false },
      isErrored: true,
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, result: { pass: false } },
      { stepIndex: 9, result: { pass: false } }
    ],
    result: {
      errors: { isCircular: false },
      isErrored: true,
      completed: false
    }
  }
]

module.exports.cases = [cases[3]]