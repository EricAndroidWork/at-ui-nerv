import * as Nerv from 'nervjs'
// import * as sinon from 'sinon'
import * as $ from 'webpack-zepto'
import {VNode} from 'nerv-shared'
import Pagination from '../index'
import sinon from 'sinon'

describe('select test', () => {
  let scratch
  beforeAll(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('basic render', () => {
    const select = <Pagination total='60' />
    const component = Nerv.render(select as VNode, scratch)
    const dom = $(Nerv.findDOMNode(component))
    expect(dom.find('.at-pagination__item').length).toBe(5)
  })

  it('more than 8 pages render', () => {
    const select = <Pagination total='100' />
    const component = Nerv.render(select as VNode, scratch)
    const dom = $(Nerv.findDOMNode(component))
    expect(dom.find('.at-pagination__item').length).toBe(5)
  })
  
  it('props page-change',(done)=>{
    const onChange = sinon.spy()
    const pagination = <Pagination onPageChange={onChange} total='60' />
    const component = Nerv.render(pagination as VNode, scratch)
    const dom = $(Nerv.findDOMNode(component))
    const trigger = dom.find('.at-pagination__item').eq(1)
    trigger.trigger('click')
    setTimeout(() => {
      console.log(onChange.called)
      expect(onChange.called).toBeTruthy()
      done()
    })
  })

  it('props page-sizechange',()=>{
    const pagination = <div>
                         <Pagination total='100' showSizer/>
                       </div>
    const component = Nerv.render(pagination as VNode, scratch)
    const dom = $(Nerv.findDOMNode(component))
    expect(dom.find('.at-pagination__sizer')).toBeTruthy()
    // trigger.trigger('click')
    // setTimeout(() => {
    //   console.log(onChange.called)
    //   expect(onChange.called).toBeTruthy()
    //   done()
    // })
  })

  it('props page-sizechange',(done)=>{
    let onChange = sinon.spy()
    const pagination = <div>
                         <Pagination total='100' onPageSizeChange={onChange} showSizer/>
                       </div>
    const component = Nerv.render(pagination as VNode, scratch)
    const dom = $(Nerv.findDOMNode(component))
    let trigger = dom.find('.at-select__option').eq(0)
    trigger.trigger('click')
    setTimeout(() => {
      expect(onChange.called).toBeTruthy()
      done()
    })
  })
})
