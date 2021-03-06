import React from 'react'
import { fireEvent, render } from 'react-testing-library'
import fetchMock from 'fetch-mock'

import waitForExpect from 'wait-for-expect'

import App from './App'

beforeEach(() => {
  window.localStorage.clear()
  window.location.href = '/'
})

async function sleep(milliseconds: number) {
  return new Promise(resolve => {
    window.setTimeout(resolve, milliseconds)
  })
}

it(`quick end-to-end flow with absent module-smartcards`, async () => {
  // this is what happens in demo mode
  fetchMock.get('/card/read', 500)

  const eventListenerCallbacksDictionary: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
  window.addEventListener = jest.fn((event, cb) => {
    eventListenerCallbacksDictionary[event] = cb
  })
  window.print = jest.fn(() => {
    eventListenerCallbacksDictionary.afterprint()
  })

  const { getByText, getByTestId, queryByText } = render(<App />)

  fireEvent.click(getByText('Load Sample Election File'))

  // wait long enough to get the /card/read to fail and flip the demo bit
  await sleep(250)

  getByText('Scan Your Activation Code')
  fireEvent.click(getByTestId('qrContainer'))

  // Go to First Contest
  fireEvent.click(getByText('Get Started'))
  fireEvent.click(getByText('Start Voting'))

  // Go to Pre Review Screen
  while (!queryByText('Review Your Selections')) {
    fireEvent.click(getByText('Next'))
  }
  getByText('Review Your Selections')

  // Go to Review Screen
  fireEvent.click(getByText('Review Selections'))
  getByText('Review Your Ballot Selections')

  // Print Screen
  fireEvent.click(getByText('Next'))
  getByText('Print your official ballot')

  // Test Print Ballot Modal
  fireEvent.click(getByText('Print Ballot'))
  fireEvent.click(getByText('Yes, print my ballot.'))
  await waitForExpect(() => {
    expect(window.print).toBeCalled()
  })

  // no need for further testing in this use case (the next step depends on ballot tracker, which is tested elsewhere.)
})
