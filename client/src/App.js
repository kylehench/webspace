import PopoverDemo from './components/PopoverDemo';
import ResponsiveGrid from './components/ResponsiveGrid';

function App() {
  
  return (
    <div className='flex max-h-screen'>
      <div className='flex flex-col justify-end p-3 bg-orange-100'>
        <PopoverDemo />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <ResponsiveGrid />
      </div>
      {/* <div className='p-10 bg-orange-100'></div> */}
    </div>
  );
}

export default App;