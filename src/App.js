import React, { useState } from 'react';


import Homz from './Components/Homz';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";


export default function App() {

  const docs_dictionary = {
    "xlx_1": "https://docs.google.com/spreadsheets/d/1S3qMOy1875Se_gNqcAxCBEaGUvbqxU7sxcJZZ8uAVj0",
    "doc_1": "https://docs.google.com/document/d/1riXRlViPwh5_SVRbbqjBjZV-vhU9AYmFggZd2J6NNn0",
    "doc_2": "https://docs.google.com/document/d/1wVZv9N03TsqqZSEI3MGXvnjwEK1U6JQ1xJb3Yku_ruU/edit",
    "doc_3": "https://forms.gle/4TRzsKWri4XXwLD88"
  }

  const docs_dictionary2 = {
    "doc_1": 'https://docs.google.com/document/d/1DUzWgVCIPJiLDNOLep7UAuMMmCWne7fWhi8CdBGIKAc',
    "doc_2": 'https://docs.google.com/document/d/1KMADRMTlqlTV_kZi2_E9CPtJLQ5LwVjV26Pshse2LQM'
  }

  const [docsUrl, setDocUrl] = useState(docs_dictionary['xlx_1']);
  console.log("iFrame URL", docsUrl)

  function IFrame(props) {
    return (
      <iframe src={props.src} style={props.style} />
    );
  };


  const googleDocIFrame2 = <div style={{}}>
    <IFrame src={docsUrl} style={{ minWidth: '640px', marginLeft: '50px', height: '80vh' }} />
  </div>;

  console.log(process.env.REACT_APP_GRAMMARLY_KEY, "gramm")
  return (
    <Router>
      <Routes>
       
        <Route path="/homz" element={
          <div style={{ maxHeight: '50vh' }}>
            <Homz docsUrl={docsUrl} setDocUrl={setDocUrl} ifr={googleDocIFrame2}
              docs_dictionary={docs_dictionary2} />
          </div>
        } />        
      </Routes>

    </Router>
  )
}
