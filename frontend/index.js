setInterval(() => {

  const div = document.getElementById('data')
  fetch('http://localhost:3000/data')
    .then(res => res.json())

    .then(json => {
      console.log(json)
      div.innerText = 'Value ' + json[0]['value']
    })
    .catch(err => console.log(err))
}, 4000)