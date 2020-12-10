const flow = {
  trigger: { outputs: [ { stepIndex: 1 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 1 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 3 } ] },      /* 2 */
    { type: 'abc', outputs: [] }                                         /* 3 */
  ]
}

module.exports.flow = flow

module.exports.cases = [
  {
    executedSteps: [],
    result: {
      errors: { isCircular: false }
    }
  },

  {
    executedSteps: [],
    result: {
      stepsToExecute: [ 0,1,2,3,'trigger' ]
    }
  },

  {
    executedSteps: [
      {}
    ],
    result: {
      stepsToExecute: [ 0,1,2,3,'trigger' ],
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2 },
      { stepIndex: 'trigger' },
    ],
    result: {
      stepsToExecute: [ 0,1,2,3,'trigger' ],
      completed: false
    }
  },

  {
    executedSteps: [
      { stepIndex: 0 },
      { stepIndex: 1 },
      { stepIndex: 2 },
      { stepIndex: 3 },
      { stepIndex: 'trigger' },
    ],
    result: {
      stepsToExecute: [ 0,1,2,3,'trigger' ],
      completed: true
    }
  }
]