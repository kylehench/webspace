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
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    axios.get(`${import.meta.env.VITE_SERVER_URI}/api/weather/`, { params: {
      datetime: now.toISOString(),
      countryCode,
      zipCode,
    }}).then(res => {
      console.log(res.data.data);
      setWeatherData(res.data.data
        .reduce((obj, paramObj) => ({...obj, [paramObj.parameter.split(':')[0]]: paramObj.coordinates[0].dates.map(date => date.value)}), {})
      )
      setWeatherDataGenerated(res.data.dateGenerated)
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

        {weatherData ?
          <>
            <div>T max: { JSON.stringify(weatherData.t_max_2m_24h) }</div>
            <div>T min: { JSON.stringify(weatherData.t_min_2m_24h) }</div>
            <div>Weather symbol: { JSON.stringify(weatherData.weather_symbol_24h) }</div>
          </>
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