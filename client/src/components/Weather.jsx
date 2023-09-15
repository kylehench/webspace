import { useState, useRef, useEffect } from 'react'
import SkeletonLoader from './primitives/SkeletonLoader'
import axios from 'axios'
import GridItem from './primitives/GridItem'
import COUNTRY_CODES from '../config/countryCodes'
import weatherSVG from '../config/weatherSVG'
import { blue } from 'tailwindcss/colors'

const TEMPERATURE_BAR_HEIGHT = 500

const Weather = ({ appState, widgetProps }) => {
  const { widgetsDispatch } = appState

  const [ loading, setLoading ] = useState(true)

  const [ countryInput, setCountryInput ] = useState('')
  const [ countryResults, setCountryResults ] = useState([])

  const [ countryCode, setCountryCode ] = useState(widgetProps.countryCode)
  const [ zipCode, setZipCode ] = useState(widgetProps.zipCode)

  const [ weatherData, setWeatherData ] = useState()
  const [ temperatureMax, setTemperatureMax ] = useState(0)
  const [ temperatureMin, setTemperatureMin ] = useState(0)
  const [ graphSlope, setGraphSlope ] = useState(0)
  const [ graphIntercept, setGraphIntercept ] = useState(0)
  const [ weatherDataGenerated, setWeatherDataGenerated ] = useState()
  const svgRefs = useRef([])

  // symbol reference: https://www.meteomatics.com/en/api/available-parameters/derived-weather-and-convenience-parameters/general-weather-state/#weather_symb
  const weatherSymbolMap = {
    0: weatherSVG.NotAvailable, 1: weatherSVG.Sunny, 2: weatherSVG.LightClouds, 3: weatherSVG.PartlyCloudy, 4: weatherSVG.Cloudy, 5: weatherSVG.Rain, 6: weatherSVG.RainMix, 7: weatherSVG.Snow, 8: weatherSVG.RainShower, 9: weatherSVG.SnowShower, 10: weatherSVG.SleetShower, 11: weatherSVG.LightFog, 12: weatherSVG.DenseFog, 13: weatherSVG.FreezingRain, 14: weatherSVG.Thunderstorms, 15: weatherSVG.Drizzle, 16: weatherSVG.Sandstorm
  }

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
    widgetsDispatch({type: "UPDATE", reactId: widgetProps.reactId, payload: {countryCode, zipCode}})
    const dayCount = 4
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
      for (let i=0; i<dayCount; i++) {
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
      const tMax = Math.max(...data.map(day => day.high))
      const tMin = Math.min(...data.map(day => day.low))
      setTemperatureMax(tMax)
      setTemperatureMin(tMin)
      const graphSlope = TEMPERATURE_BAR_HEIGHT/(tMin-tMax)
      setGraphSlope(graphSlope)
      setGraphIntercept(-tMax*graphSlope)
      setWeatherDataGenerated(new Date())
    })
  }

  useEffect(() => {
    if (widgetProps.countryCode && widgetProps.zipCode) {
      weatherRequest()
      setInterval(() => {
        weatherRequest()
      }, 5*60_000)
    }
  }, [])

  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      titleLeft={<div className='px-6'></div>}
      title='Weather'
    >
      <div className='py-2 pl-2 h-full thin-scrollbar-parent'>
        { weatherData ?

          // display weather if weatherData is present
          <div className='h-full flex justify-between items-stretch divide-x divide-slate-300'>
            { weatherData.map((day) => {
              const barY = graphSlope*day.high + graphIntercept
              const barHeight = graphSlope*day.low + graphIntercept - (graphSlope*day.high + graphIntercept)
              return (
                <div
                  className='p-0.5 px-2 flex-1'
                  key={day.key}
                >
                  <div className='h-full flex flex-col items-center'>
                    <div>{day.weekday}</div>
                    <img src={weatherSymbolMap[day.weatherSymbol]} className='my-1 max-w-[48px]'/>
                    <div className='w-8'>
                      <svg
                        viewBox={`0 -60 100 ${TEMPERATURE_BAR_HEIGHT+160}`}
                        ref={svgRefs[day.key]}
                      >
                        <text
                          // className='fill-red11'
                          x='55%'
                          y={barY-20}
                          textAnchor='middle'
                          fontSize='52'
                        >{day.high}&deg;</text>
                        <rect
                          x={0}
                          y={barY}
                          width={100}
                          height={barHeight}
                          ry={50}
                          fill={blue[200]}
                          />
                        <text
                          // className='fill-blue11'
                          x='55%'
                          y={barHeight+barY+60}
                          textAnchor='middle'
                          fontSize='52'
                        >{day.low}&deg;</text>
                      </svg>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        : <>
          {(!widgetProps.zipCode && !widgetProps.countryCode) ?

            // display form if zipCode and countryCode is unknown, otherwise display loading symbol
            <div className='h-full flex flex-col justify-center px-3 overflow-auto thin-scrollbar'>

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
                <div className="mt-2 mb-4 flex justify-center">
                  <button
                    className="rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-slate-200 text-slate-500 hover:bg-slate-300 focus:shadow-[0_0_0_2px] focus:shadow-slate-400 outline-none cursor-default"
                    onClick={weatherRequest}
                  >
                    Set Location
                  </button>
                </div>

              </div>
            :
            
              // skeleton loader
              <SkeletonLoader />

          }

        </>}
      </div>
    </GridItem>
  )
}

export default Weather