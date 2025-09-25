const BlurCircle = ({top="auto", left="auto", right="auto", bottom="auto"}) => {
  return (
    <div className="absolute -z-20 -left-24 top-10 h-96 w-96 animate-blob rounded-full bg-teal-400 opacity-60 blur-2xl filter"
    style={{top:top, left:left, right:right, bottom:bottom}}>

    </div>
  )
}

export default BlurCircle