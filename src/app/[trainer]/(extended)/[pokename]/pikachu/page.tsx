function Pikachu({ params: { trainer, pokename }}: { params: { trainer: string, pokename: string } }) {
  return (<div>
    <p>Pikachu</p>
    <p>Name: {pokename}</p>
    <p>Caught By: {trainer}</p>
  </div>
  )
}

export default Pikachu
