import { useState, useEffect } from 'react'
import axios from 'axios'
import GridItem from './primitives/GridItem'
import COUNTRY_CODES from '../config/countryCodes'

const Weather = ({ appState, widgetProps }) => {
  const { widgetsDispatch } = appState

  const [ loading, setLoading ] = useState(true)

  const [ countryInput, setCountryInput ] = useState('')
  const [ countryResults, setCountryResults ] = useState([])
  const [ countryCode, setCountryCode ] = useState('')
  const [ zipCode, setZipCode ] = useState('')

  const [ weatherData, setWeatherData ] = useState()
  const [ weatherDataGenerated, setWeatherDataGenerated ] = useState()

  const handleCountryInput = e => {
    setCountryCode('')
    const input = e.target.value
    setCountryInput(input)
    if (!input) {
      setCountryResults([])
    } else {
      setCountryResults(COUNTRY_CODES
        .filter(country => country.name.toLowerCase().indexOf(input.toLowerCase())!=-1)
        .slice(0, 3)
      )
    }
  }

  const weatherRequest = () => {
    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)
    axios.get(`${import.meta.env.VITE_SERVER_URI}/api/weather/`, { params: {
      dayStart: dayStart.toISOString(),
      countryCode,
      zipCode,
    }}).then(res => {
      let currentDay = dayStart
      const getWeekDayAndIncrement = () => {
        const weekday = new Intl.DateTimeFormat("en-US", {weekday: 'short'}).format(currentDay)
        currentDay.setHours(currentDay.getHours() + 24)
        return weekday
      }
      let data = []
      for (let i=0; i<4; i++) {
        data.push({
          key: currentDay,
          weekday: getWeekDayAndIncrement(),
          high: Math.round(res.data.highs[i]),
          // note: tomorrow's low is used as "tonight's low" is displayed for each day
          low: Math.round(res.data.lows[i+1]),
          weatherSymbol: res.data.weather_symbol[i],
        })
      }
      setWeatherData(data)
      setWeatherDataGenerated(new Date())
    })
  }

  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      titleLeft={<div className='px-6'></div>}
      title='Weather'
    >
      <div className='py-2 pl-2 h-full thin-scrollbar-parent'>
        { weatherData ?
          <div className='h-full flex justify-between items-stretch divide-x divide-slate-300'>
            { weatherData.map((day) => 
              <div
                className='p-0.5 px-2 flex-1'
                key={day.key}
              >
                <div className='h-full flex flex-col items-center'>
                  <div>{day.weekday}</div>
                  <div>{day.icon}</div>
                  <div className='mx-1'>
                    <div className='text-red10'>{day.high}</div>
                    <div className='text-blue10'>{day.low}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        :
          <div className='h-full px-3 overflow-auto thin-scrollbar'>

            {/* country search box */}
            <fieldset className="mb-[10px] flex flex-col justify-start">
              <label className="text-[13px] leading-none mb-2.5 text-cyan12 block">
                Enter Country
              </label>
              <input
                className={`grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[33px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none  ${countryCode ? 'bg-green-100' : 'bg-white'}`}
                type="text"
                value={countryInput}
                onChange={handleCountryInput}
              />
            </fieldset>

            {/* country list picker */}
            <div className='absolute border rounded bg-white'>
              { countryResults.map(({code, name}, i) =>
                <div
                  key={code}
                  className='w-60 border-cyan11 p-2.5 text-[15px] leading-none text-cyan11 border-1 shadow-cyan7 cursor-pointer truncate hover:bg-slate-200'
                  onClick={() => {
                    setCountryCode(code)
                    setCountryInput(name)
                    setCountryResults([])
                  }}
                >
                  {name}
                </div>
              )}
            </div>

            {/* zip code input */}
            <fieldset className="mb-[10px] w-full flex flex-col justify-start">
              <label className="text-[13px] leading-none mb-2.5 text-cyan12 block">
                Enter Zip Code
              </label>
              <input
                className='grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[33px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none bg-white'
                type="text"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
              />
            </fieldset>

            {/* set location button */}
            <div className="mt-3 flex justify-center">
              <button
                className="rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-slate-200 text-slate-500 hover:bg-slate-300 focus:shadow-[0_0_0_2px] focus:shadow-slate-400 outline-none cursor-default"
                onClick={weatherRequest}
              >
              Set Location
            </button>
        </div>

          </div>
        }
      </div>
    </GridItem>
  )
}

export default Weather