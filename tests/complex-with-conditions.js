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
    { type: 'abc', outputs: [] },                                        /* 3 */
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

module.exports.cases = [
  {
    executedSteps: [
    ],
    result: {
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 2, pass: false }
    ],
    result: {
      errors: { isCircular: false },
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 'trigger' },
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2, pass: true },
      { stepIndex: 4 },
      { stepIndex: 5 },
      { stepIndex: 6 },
      { stepIndex: 8 },
      { stepIndex: 9, pass: true }
    ],
    result: {
      errors: { isCircular: false },
      executedSteps: [ 0, 1, 2, 4, 5, 6, 8, 9, 'trigger' ],
      completed: true
    }
  },

  {
    executedSteps: [
      { stepIndex: 'trigger' },
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2, pass: true },
      { stepIndex: 4 },
      { stepIndex: 5 },
      { stepIndex: 8 }, // removed step 6 on purpose so steps to be executed
                        // does not matches
      { stepIndex: 8 },
      { stepIndex: 9, pass: true }
    ],
    result: {
      errors: { isCircular: false },
      executedSteps: [ 0, 1, 2, 4, 5, 6, 8, 9, 'trigger' ],
      completed: false
    }
  }
]