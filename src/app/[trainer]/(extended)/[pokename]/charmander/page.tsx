function Charmander({ params: { trainer, pokename }}: { params: { trainer: string, pokename: string } }) {
  return (<div>
    <p>Charmander</p>
    <p>Name: {pokename}</p>
    <p>Caught By: {trainer}</p>
  </div>
  )
}

export default Charmander
