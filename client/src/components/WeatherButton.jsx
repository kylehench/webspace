import ButtonTooltip from './primitives/ButtonTooltip'
import { TiWeatherCloudy } from "react-icons/ti";

const WeatherButton = ({ appState }) => {
  const { layoutDispatch, widgetsDispatch } = appState

  const addWeather = () => {
    const reactId = Math.random().toString().slice(2,14)
    widgetsDispatch({type: "CREATE", payload: {
      type: 'weather',
      reactId
    }})
    layoutDispatch({type: "CREATE", payload: {i: reactId, h: 2}})
  }
  
  return (
    <ButtonTooltip
      icon={<TiWeatherCloudy size={20} />}
      hoverText='Weather'
      side='right'
      onClick={addWeather}
    />
  )
}

export default WeatherButton