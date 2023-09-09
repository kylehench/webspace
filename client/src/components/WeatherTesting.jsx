import GridItem from './primitives/GridItem'

const WEATHER_DATA = [
  {icon: 'i1', label: 'Today', high: '80', low: '60'},
  {icon: 'i2', label: 'Wed', high: '82', low: '62'},
  {icon: 'i3', label: 'Thursday', high: '80', low: '61'},
  {icon: 'i4', label: 'Friday', high: '78', low: '55'},
]

const Quote = ({ appState, widgetProps }) => {

  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      titleLeft={<div className='px-6'></div>}
      title='Daily Quote'
      titleRight={
        <div className='flex items-center'>

        </div>
      }
    >
      <div className='pr-2 flex justify-between bg-blue-300'>
        { WEATHER_DATA.map((day, i) => 
          <div
            className='py-0.5 px-2 border'
            key={i}
          >
            <div>{day.label}</div>
            <div className="flex">
              <div>{day.icon}</div>
              <div className='mx-1'>
                <div className='text-red10'>{day.high}</div>
                <div className='text-blue10'>{day.low}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GridItem>
  )
}

export default Quote