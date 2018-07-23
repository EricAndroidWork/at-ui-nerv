import * as Nerv from 'nervjs'
import SelectOption from './select-option'
import SelectOptionGroup from './select-optiongroup'
export interface SelectProps {
    className?: string,
    icon?: string
    hollow?: boolean
    nativeType?: string
    loading?: boolean
    circle?: boolean
    disabled?: boolean
}

class Select extends Nerv.Component<SelectProps, any> {
    static Option: typeof SelectOption
    static OptionGroup: typeof SelectOptionGroup
    private DISPLAY_BLOCK = { display: 'block'}
    private DISPLAY_NONE = { display: 'none'}
    private propsSelectOption: any[]
    private mulOptionChosen: any[]
    private searchOption: any[]
    constructor (props) {
      super(props)
      let optionChosen: any = []
      if (this.props.value) {
        optionChosen = optionChosen.concat(this.props.value)
      }
      this.state = {
        isDropDown: false,
        optionChosen: optionChosen || [], //存的都是下标
        optionShow: [], //针对filterable,存的也是下标
        selected: optionChosen.length > 0 ? true : false,
        calcBottom: 0
      }
      this.mulOptionChosen = []
      this.propsSelectOption = []
      this.searchOption = []
      this.handleClick = this.handleClick.bind(this)
      this.toggleDropDown = this.toggleDropDown.bind(this)
      this.windowClickHideAll = this.windowClickHideAll.bind(this)
      this.handleChose = this.handleChose.bind(this)
      this.handleClear = this.handleClear.bind(this)
      this.handleInput = this.handleInput.bind(this)
    }
    renderSelectOption () {
      if (this.props.filterable) {
        const optionShowDom: any[] = []
        this.state.optionShow.forEach((item) => {
          optionShowDom.push((this.props.children || [])[item])
        })
        return optionShowDom
      } else {
        return this.props.children
      }
    }
    renderToggleArrowClass () {
      let style = 'at-select '
      if (this.props.disabled) {
        style += ' at-select--disabled'
      }
      if (this.props.clearable && this.state.selected) {
        style += ' at-select--show-clear'
      }
      style += this.state.isDropDown ? ' at-select--visible' : ''
      style += ' at-select--single at-select--normal'
      return style
    }
    renderSingleSelect () {
      if (this.props.multiple || this.props.filterable) {return}
      const propsChildren = this.getPropsSelectOption()
      const style = this.state.selected ? this.DISPLAY_BLOCK : this.DISPLAY_NONE
      const chosen = this.state.optionChosen[0]
      const chosenChildren = propsChildren[chosen] || {props: {label: '', children: []}}
      const chosenSpan = chosenChildren.props.label || chosenChildren.props.children//没有label会选择标签结构本身
      return <span className='at-select__selected' style={style}>{chosenSpan}</span>
    }
    renderMultipleSelect () {
      if (!this.props.multiple) {return}
      const chosen = this.state.optionChosen
      const result: any[] = []
      chosen.forEach((item, index) => {
        const chosenChildren = (this.getPropsSelectOption() || [])[item]
        const key = chosenChildren.props.key
        const chosenSpan = chosenChildren.props.label || chosenChildren.props.children
        result.push(<span className='at-tag'>
                        <span className='at-tag__text'>{chosenSpan}</span>
                        <i className='icon icon-x at-tag__close' onClick={this.removeMultipleChoice.bind(this, key)}></i>
                      </span>)
      })
      return result
    }
    getPropsSelectOption () {
      return this.propsSelectOption //特别针对OptionGroup
    }
    calculatePopoverStyle () {
      const bottom = this.refs.trigger.offsetHeight
      this.setState({
        calcBottom: bottom
      })
    }
    prepareDropDownStyle () {
      let newDropDownStyle = {}
      if (this.props.placement == 'top') {
        newDropDownStyle = {
          bottom: `${this.state.calcBottom}px`
        }
      }
      const style = {...newDropDownStyle, ...(this.state.isDropDown ? this.DISPLAY_BLOCK : this.DISPLAY_NONE)}
      return style
    }
    render () {
      const dropDownStyle = this.prepareDropDownStyle()
      const {style} = this.props
      let placeholderStyle = {}
      if (this.state.selected || this.props.filterable) {
        placeholderStyle = this.DISPLAY_NONE
      } else {
        placeholderStyle = this.DISPLAY_BLOCK
      }
      const renderSelectDom = this.renderSelectOption()
      let notFoundStyle = this.DISPLAY_NONE
      let listStyle = this.DISPLAY_BLOCK
      if (this.props.filterable && this.state.notFound) {
          notFoundStyle = this.DISPLAY_BLOCK
          listStyle = this.DISPLAY_NONE
      }
      return (
      <div className={this.renderToggleArrowClass()} data-v-a01f69b8='' style={style}>
        <div className='at-select__selection' ref='trigger' onClick={this.handleClick}>
          {this.renderMultipleSelect()}
          <span className='at-select__placeholder' style={placeholderStyle}>{this.props.placeholder || '请选择'}</span>
          {this.renderSingleSelect()}
          {this.renderSearchInput()}
          <i className='icon icon-chevron-down at-select__arrow'/>
          {this.renderClearBtn()}
        </div>
        <div className='at-select__dropdown at-select__dropdown--bottom' style={dropDownStyle}>
          <ul className='at-select__not-found' style={notFoundStyle}>
            <li>{this.props.notFoundText || '无匹配数据'}</li>
          </ul>
          <ul className='at-select__list' style={listStyle}>{renderSelectDom}</ul>
        </div>
      </div>)
    }
    renderSearchInput () {
      if (this.props.filterable) {
        const chosenIndex = this.state.optionChosen[0]
        const propsChildren = this.props.children || []
        const chosenChild = propsChildren[chosenIndex] || {label: ''}
        const chosenSpan = chosenChild.label || (chosenChild.props || {}).children
        return (<input type='text' placeholder={this.props.placeholder || '请选择'} value={chosenSpan} onChange={this.handleInput} className='at-select__input' />)
      }
    }
    handleInput (event) {
      const inputValue = event.target.value
      const result: any[] = []
      if (event.target.value == '') {
        this.propsSelectOption.forEach((item, index) => {
          result.push(index)
        })
        this.setState({
          optionChosen: [],
          notFound: false
        })
      } else {
        this.searchOption.forEach((item, index) => {
          const pattern = new RegExp(inputValue)
          if (pattern.test(item)) {
            result.push(index)
          }
        })
      }
      if (result.length > 0) {
        this.setState({
          optionShow: result,
          notFound: false
        })
      }  else {
        this.setState({
          notFound: true
        })
      }
    }
    renderClearBtn () {
      if (!this.props.multiple && this.props.clearable && this.state.selected) {
        return (<i className='icon icon-x at-select__clear' onClick={this.handleClear}></i>)
      }
      return
    }
    handleClear (event) {
      event.stopPropagation()
      this.setState({
        optionChosen: [],
        selected : false
      })
    }
    handleChose (event, index, disabled) {
      if (disabled) {
        event.stopPropagation()
        return
      }
      let returnValue: any[] = []
      if (this.props.multiple) {
        event.stopPropagation()
        if (this.mulOptionChosen.indexOf(index) == -1) {
          this.mulOptionChosen.push(index)
          this.setState({
            optionChosen: this.mulOptionChosen,
            selected : true
          })
          this.mulOptionChosen.forEach((item) => {
            const child = this.propsSelectOption[item] || {}
            const value = child.props.value
            const label = child.props.label
            returnValue = this.prepareReturnValue(returnValue, value, label)
          })
        }
      } else {
          const optionChosen: any[] = []
          optionChosen.push(index)
          this.setState({
            optionChosen,
            selected : true
          })
          optionChosen.forEach((item) => {
            const child = this.propsSelectOption[item] || {}
            const value = child.value
            const label = child.label
            returnValue = this.prepareReturnValue(returnValue, value, label)
          })
      }
      this.props.onChange && this.props.onChange(returnValue)
      return returnValue
    }
    prepareReturnValue (returnValue, value, label) {
      if (this.props.valueWithLabel) {
        returnValue.push({
          value
        })
      } else {
        returnValue.push({
          value,
          label
        })
      }
      return returnValue
    }
    removeMultipleChoice (index, event) {
      if (this.props.multiple) {
        event.stopPropagation()
        const optionChosen = this.state.optionChosen //选项的下标
        let indexInArr = 0
        optionChosen.forEach((item, i) => {
          if (index == item) {
            indexInArr = i
          }
        })
        optionChosen.splice(indexInArr, 1)
        // this.mulOptionChosen.splice(indexInArr,1)
        const selected = optionChosen.length <= 0 ? false : true
        this.setState({
            optionChosen,
            selected
        })
        let returnValue: any[] = []
        optionChosen.forEach((item) => {
          const child = this.propsSelectOption[item] || {}
          const value = child.props.value
          const label = child.props.label
          returnValue = this.prepareReturnValue(returnValue, value, label)
        })
        this.props.onChange && this.props.onChange(returnValue)
      }

    }
    componentWillMount () {
      let count = 0
      //目前只会处理一次select选项处理。一旦SelectOption有变化,将得不到变化。
      Nerv.Children.forEach(this.props.children as any, (child, index) => {
        if (child.name != 'SelectOptionGroup') {
          child.props.onClick = this.handleChose
          child.props.key = index
          child.key = index
          this.propsSelectOption.push(child)
          this.searchOption.push(child.label || child.props.children) //特别针对输入查找的情况，缓存在一个属性中，加快查找速度，只允许lable和文字嵌套在第一层
        } else  {
          Nerv.Children.forEach(child.props.children as any, (child) => {
            child.props.onClick = this.handleChose
            child.props.key = count
            child.key = count
            this.propsSelectOption.push(child)
            this.searchOption.push(child.label || child.props.children)
            count ++
          }, null)
        }
      }, null)
    }
    componentWillUpdate (nextProps, nextState) {
      Nerv.Children.forEach(this.props.children as any, (child, index) => {
        if (child.name != 'SelectOptionGroup') {
          //单选选择，通知每个选项，是否要变黑加粗
          child.props.chosenIndex = nextState.optionChosen
        } else  {
          Nerv.Children.forEach(child.props.children as any, (child) => {
            //单选选择，通知每个选项，是否要变黑加粗
            child.props.chosenIndex = nextState.optionChosen
          }, null)
        }
      }, null)
    }
    handleClick (event) {
      if (this.props.disabled) { return }
      event.stopPropagation()
      this.toggleDropDown()
      if (this.props.filterable) {
        const optionShow: any[] = []
        this.propsSelectOption.forEach((item, index) => {
          optionShow.push(index)
        })
        this.setState({
          optionShow
        })
      }
    }
    toggleDropDown () {
      const isDropDown = this.state.isDropDown
      this.setState({
        isDropDown: !isDropDown
      })
    }
    windowClickHideAll () {
      this.setState({
        isDropDown: false
      })
    }
    componentDidMount () {
      this.calculatePopoverStyle()
      window.addEventListener('click', this.windowClickHideAll)
    }
    componentWillUnmount () {
      window.removeEventListener('click', this.windowClickHideAll)
    }

 }

export default Select
