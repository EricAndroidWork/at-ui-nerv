import * as Nerv from 'nervjs'
import * as sinon from 'sinon'
import * as $ from 'webpack-zepto'

import Radio from '../'

describe('Radio test', () => {
  let scratch
  beforeAll(() => {
    scratch = document.createElement('div')
    document
      .body
      .appendChild(scratch)
  })

  beforeEach(() => {
    scratch = document.createElement('div')
    document
      .body
      .appendChild(scratch)
  })

  afterAll(() => {
    scratch
      .parentNode
      .removeChild(scratch)
    scratch = null
  })
  it('basic render', () => {
    const onChange = sinon.spy()
    const radioJSX = (

      <Radio onChange={onChange} value={'2'} label='1'>
        选项一
      </Radio>

    )
    const component = Nerv.render(radioJSX, scratch)
    expect($(component.dom).find('.at-radio__inner').hasClass('at-radio--checked')).toBeFalsy()
  })
  it('disabled', () => {
    const onChange = sinon.spy()
    class Test extends Nerv.Component {
      state = {
        radio1: 0
      }
      render () {
        return (
          <div>
            <Radio
              onChange={(label) => {
                onChange()
                this.setState({ radio1: label })
            }}
              disabled
              value={this.state.radio1}
              label='1'>
              选项一
            </Radio>
            <Radio
              onChange={(label) => {
              this.setState({radio1: label})
            }}
              value={this.state.radio1}
              label='2'
              Radio>
              选项二
            </Radio>
          </div>
        )
      }
    }
    const component = Nerv.render(
      <Test/>, scratch)
    $(component.dom)
      .find('.at-radio')
      .eq(0)
      .trigger('click')
    Nerv.nextTick(() => {
      expect(onChange.called).toBeFalsy()
    })
  })
  it('radioGroup', () => {
    const onChange = sinon.spy()
    const radioGroupJSX = (
      <Radio.Group
        value={1}
        onRadioGroupChange={(label) => {
          onChange(label)
      }}>
        <Radio label='1'>选项一</Radio>
        <Radio label='2'>选项二</Radio>
        <Radio label='3'>选项三</Radio>
      </Radio.Group>
    )
    const component = Nerv.render(radioGroupJSX, scratch)
    $(component.dom).find('.at-radio').eq(0).trigger('click')
    expect(onChange.args).toEqual([['1']])
  })
})