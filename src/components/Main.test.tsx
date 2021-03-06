import React from 'react'
import { render } from 'react-testing-library'

import Main, { MainChild } from './Main'

it(`renders Main with child`, () => {
  const { container } = render(
    <Main>
      <MainChild>foo</MainChild>
    </Main>
  )
  expect(container.firstChild).toMatchSnapshot()
})

it(`renders centered content`, () => {
  const { container } = render(
    <Main>
      <MainChild center>foo</MainChild>
    </Main>
  )
  expect(container.firstChild).toMatchSnapshot()
})

it(`renders not centered content`, () => {
  const { container } = render(
    <Main>
      <MainChild centerHorizontal={false}>foo</MainChild>
    </Main>
  )
  expect(container.firstChild).toMatchSnapshot()
})
