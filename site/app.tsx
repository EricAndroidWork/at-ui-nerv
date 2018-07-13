import * as Nerv from 'nervjs'

// import ButtonExample from './view/Button'
// import TagExample from './view/Tag'
import SelectExample from './view/Select'
import IconExample from './view/Icon'
import SwitchExample from './view/Switch'
import TooltipExample from './view/Tooltip'
import PopoverExample from './view/Popover'
import StepExample from './view/Steps'
import TextareaExample from './view/Textarea'
import TableExample from './view/Table'
import 'at-ui-style'

class App extends Nerv.Component {
  render () {
    return (
      <div className='app' id='app'>
        {/* <ButtonExample /> */}
        {/* <TagExample /> */}
        <SelectExample />
        <IconExample />
        <SwitchExample />
        <TooltipExample />
        <PopoverExample />
        <StepExample />
        <TextareaExample />
        <TableExample />
      </div>
    )
  }
}

Nerv.render(<App />, document.getElementById('container') as Element)
