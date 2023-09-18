import ContentLoader from "react-content-loader"
import { gray } from "tailwindcss/colors"

const SkeletonLoader = () => {
  return (
    <div className=''>
      <ContentLoader 
        className='w-full'
        speed={2}
        width='100%'
        viewBox="0 10 270 270"
        foregroundColor={gray[200]}
      >
        <circle cx="31" cy="31" r="15" /> 
        <rect x="58" y="18" rx="2" ry="2" width="197" height="10" /> 
        <rect x="58" y="34" rx="2" ry="2" width="197" height="10" /> 
        <rect x="15" y="60" rx="2" ry="2" width="240" height="200" />
      </ContentLoader>
    </div>
  )
}

export default SkeletonLoader