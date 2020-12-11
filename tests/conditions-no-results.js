const flow = {
  trigger: { outputs: [ { stepIndex: 1 } ] },
  steps: [
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 0 */
    { type: 'abc', outputs: [ { reason: 'step', stepIndex: 2 } ] },      /* 1 */
    { type: 'conditions', outputs: [ ] }                                 /* 2 */
  ]
}

module.exports.flow = flow

module.exports.cases = [
  {
    executedSteps: [],
    result: {
      stepsToExecute: undefined,
      errors: {
        hasEmptyConditions: true,
        isCircular: false
      },
      completed: false,
      isErrored: true
    }
  }
]