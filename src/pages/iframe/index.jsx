import { useState, useEffect } from "react";
import { PineconeClient } from "@pinecone-database/pinecone";
import Search from '../../../components/search';
import { useRouter } from 'next/router';


export default function Home() {

  const [loadingData, setLoading] = useState(false)
  const [aiText, setAiText] = useState('This is ai text. This is ai text. This is ai text.')
  const [prompt, setPrompt] = useState('')
  
  useEffect(()=>{
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh();

  window.addEventListener('resize', () => {
      setVh();
  });

  window.addEventListener('scroll', () => {
      const { scrollTop } = document.documentElement;

      document.documentElement.style.setProperty('--scroll', scrollTop);
      console.log('runss --> ' + scrollTop)
      
      
      const boxes = document.querySelectorAll('.box');
      boxes.forEach(box => {
          const boxHeight = box.offsetHeight;
          console.log(boxHeight);
      });
  });
  }, [])

  //this pinecone isn't used
  const pineconeClient = new PineconeClient();
  pineconeClient.init({
      environment: "us-central1-gcp",
      apiKey: "deaf3c5e-9b6f-4cae-bc93-94c7b7c0edd1",
  });

  const [data, setData] = useState([]);
  const [inputValue,setInputValue] = useState('')
  async function handleClick(input) {
    
    /*await query([inputValue]).then((embed)=> {
      setEncode(embed)
    })*/

    setLoading(true)

    var formData = {
      query: input,
      namespace: "bornacrime",
      index: "books"
    };
    fetch("http://localhost:8000/query", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.response)
      setData(data.response.documents);
      setAiText(data.response.result)
      setPrompt(data.response.query)
    })

    /*
    const options = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        lookup:input,
      })//JSON.stringify(encode)
    }
    
    if(input.length === 0){
      setData([])
    }else{
      await fetch('api/hello', options).then(response => response.json())
      .then(data => {
        // Access the resolved value of the promise here
        setData(data.newUpdate.matches)
      });
    }*/
    setLoading(false)
  }

  async function update(event){
    await setInputValue(event.target.value)
    //handleClick(event.target.value)
  }
  async function clear(event){
    await setInputValue('')
  }
  
  return (
    <div>
      <Search inputValue={inputValue} data={[data, setData]} writtenText={[aiText, prompt]} update={update} handleClick={handleClick} clear={clear} loadingData={loadingData} colors={{back:'#ff00ff', front:'#eeeeee', text:'black'}}/>
      </div>
  )
}