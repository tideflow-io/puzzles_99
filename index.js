/**
 * Compare two 2d arrays.
 *  
 * @param {*} arr1 
 * @param {*} arr2 
 * @return {boolean}
 */
const compareArrays = (arr1, arr2) => {
  return arr1.sort().join() === arr2.sort().join()
}

const calledFrom = flow => {
  let c = {} //

  const processOutputs = (outputs, index) => {
    (outputs || []).map(output => {
      let outputId = output.stepIndex
      if (!c[outputId]) c[outputId] = []
      c[outputId].push(index)
    })
  }

  flow.steps.map((step, index) => processOutputs(step.outputs, index))
  processOutputs(flow.trigger.outputs, 'trigger')

  return c
}

/**
 * Given a flow, returns the list of tasks that only depends on the flow's trigger.
 * 
 * For the flow:
 * +--------------------+
 * | +-------+      +-+ |
 * | |Trigger|----->|0| |
 * | +-------+      +-+ |
 * |                    |
 * |    +-+    +-+      |
 * |    |1|--->|2|      |
 * |    +-+    +-+      |
 * +--------------------+
 * Result is [0]
 * 
 * @param {Object} flow 
 */
const guessTriggerSingleChilds = flow => {
  const listOfCalls = calledFrom(flow)
  let result = []
  Object.keys(listOfCalls).map(stepIndex => {
    if (compareArrays(listOfCalls[stepIndex], ['trigger'])) {
      result.push(parseInt(stepIndex))
    }
  })
  return result
}

/**
 * Given a flow, return the list of tasks that don't have any preceding one.
 * 
 * For the flow:
 * +--------------------+
 * | +-------+          |
 * | |Trigger|------v   |
 * | +-------+     +-+  |
 * |               |1|  |
 * |    +-+        +-+  |
 * |    |0|---------^   |
 * |    +-+             |
 * +--------------------+
 * 
 * return [0]
 * 
 * @param {Object} flow 
 */
const guessStepsWithoutPreceding = (flow) => {
  // Build a list with all the steps indexes.
  // [0, 1]
  const allSteps = flow.steps.map((s,i)=>i)

  // List of steps indexes that are connected to the trigger
  // The result is [1]
  let triggerNextSteps = flow.trigger.outputs.map(o => o.stepIndex)

  // The result is [0]
  flow.steps.map((step, index) => {
    triggerNextSteps = triggerNextSteps.concat( (step.outputs || []).filter(s => s.stepIndex !== index).map(s => s.stepIndex) )
  })

  // The result is [ [0,1], [1] ]
  const lists = [allSteps, triggerNextSteps]
  // The result is [ 0 ]
  const cardsWithoutInbound = lists.reduce((a, b) => a.filter(c => !b.includes(c)))

  return cardsWithoutInbound || []
}

const requirementsFulfilled = (executedTasks, requirements) => {
  executedTasks = [...new Set(executedTasks)]
  requirements = [...new Set(requirements)]

  let r = [executedTasks || [], requirements || []].reduce((a, b) => a.filter(c => b.includes(c)))
  return r.length === requirements.length
}

const callsTo = flow => {
  let c = {} //

  c['trigger'] = flow.trigger.outputs.map(out => out.stepIndex)
  flow.steps.map((step, index) => {
    c[index] = step.outputs.map(out => out.stepIndex)
  })

  return c
}

const isCircular = flow => {
  let result = false
  const thisCallsto = callsTo(flow)
  const path = (list, next) => {
    if (arrayIntersects(list, next)) {
      result = true
      return;
    }
    return next.map(n => path(list.concat(n), thisCallsto[n]))
  }

  path(['trigger'], thisCallsto.trigger || [])
  guessStepsWithoutPreceding(flow).map(np => {
    path([np], thisCallsto[np])
  })

  return result
}

const stepsToExecute = (flow, results) => {
  let toExecute = []
  let toDiscard = []
  
  const push = el => {
    if (!toExecute.includes(el)) toExecute.push(el)
  }

  const isCond = stepIndex => {
    return flow.steps[stepIndex].type === 'conditions' ? flow.steps[stepIndex] : null
  }

  /**
   * { type: 'conditions', outputs: [ { reason: 'conditions-true', stepIndex: 4} ] }
   */
  const outputsToExecute = (condition, stepIndex) => {
    let execution = results.find(r => r.stepIndex === stepIndex)
    if (!execution) return []
    
    // Boolean
    let pass = execution.pass

    let outputs = condition.outputs.filter(o => {
      return o.reason === (pass ? 'condition-true' : 'condition-false')
    })

    return outputs.map(o => o.stepIndex)
  }

  const thisCallsto = callsTo(flow)
  const path = (list, next) => {
    // Flag as executed
    list.map(l => push(l))

    return next.map(n => {
      let conditionalStep = isCond(n)
      if (conditionalStep) {
        return path(list.concat(n), outputsToExecute(conditionalStep, n))
      }
      return path(list.concat(n), thisCallsto[n])
    })
  }

  path(['trigger'], thisCallsto.trigger || [])
  guessStepsWithoutPreceding(flow).map(np => {
    path([np], thisCallsto[np])
  })

  return toExecute
}

const hasEmptyCondition = flow => {
  return flow.steps.find(s => s.type === 'conditions' && !s.outputs.length)
}

const arrayIntersects = (a, b) => {
  return !!(a || []).filter(value => (b || []).includes(value)).length
}

const analyze = (flow, stepsResults) => {
  let result = {
    steps: flow.steps.length,
    errors: {
      hasEmptyConditions: !!hasEmptyCondition(flow),
      isCircular: !!isCircular(flow)
    }
  }

  result.isErrored = !!Object.values(result.errors).find(e => !!e)

  if (result.isErrored) {
    return result
  }
  result.stepsExecuted = (stepsResults||[]).map(s => s.stepIndex)

  try {
    result.stepsToExecute = stepsToExecute(flow, stepsResults || []).sort()
    result.completed = (
      JSON.stringify(result.stepsToExecute) === JSON.stringify(result.stepsExecuted.sort())
    )
  } catch (ex) {
    console.log({ex})
    result.stepsToExecute = 'unknown'
    result.completed = false
  }

  return result
}

// =============================================================================
// HANDMADE ====== RUNS THE TESTS
// =============================================================================

let tests = require('./tests')


Object.keys(tests).map(test => {
  const { flow, cases } = tests[test]
  
  cases.map((testCase, testCaseIndex) => {
    const { executedSteps, result } = testCase
    let analysis = analyze(flow, executedSteps)
    Object.keys(result).map(k => {
      if (k === 'errors') return;
      if (JSON.stringify(result[k]) !== JSON.stringify(analysis[k])) {
        console.log(`${test} => ${testCaseIndex} => ${k}`)
        console.log(`  expected ${JSON.stringify(result[k])}`)
        console.log(`       got ${JSON.stringify(analysis[k])}`)
        console.log(`${JSON.stringify(analysis)}\n\n`)
      }
    })
  })
})
