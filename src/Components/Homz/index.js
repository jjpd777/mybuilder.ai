import React, { useEffect } from 'react';
import { Row, Col, Button, Card, Menu, Dropdown, Input, Divider, Checkbox } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ModalExplanation from './ModalExplanation';
import { GoogleOutlined, FilePdfTwoTone } from '@ant-design/icons'


import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";

const APIKEY = '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'





async function fetchDocument(baseURL) {

    try {
        const response = await axios.get(`${baseURL}/export?format=txt`);
        const documentText = await response.data;


        console.log(documentText, "Text body successfully fetched");
        return documentText;
        // do something with the documentText data
    } catch (error) {
        console.error(error);
    }
}

async function callBackendCompletionGPT4(system, user_content) {

    const system_instrunctions = { 'role': 'system', 'content': system };
    const context_information = { 'role': 'user', 'content': user_content };

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [system_instrunctions, context_information],
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${APIKEY}`
                }
            }
        );

        // Process the response data
        console.log(response.data);
        return response.data.choices[0].message.content;
    } catch (error) {
        // Handle any errors that occurred during the request
        console.error(error);
        return "Error"
    }

}





const ExampleLayout = ({ ifr, docsUrl, setDocUrl, docs_dictionary }) => {
    const [inputValue, setInputValue] = useState('De acuerdo a estas especificaciones de construcción, por favor sugerir por lo menos 3 variaciones de viviendas o apartamentos construibles en este terreno.');
    const [emoji, setEmoji] = useState("🧠");
    const [count, setCount] = useState(0);
    const { demo_user_name } = useParams();
    const [checkDoc, setCheckDoc] = useState({ doc_1: true, doc_2: true });

    useEffect(() => { setDocUrl(docs_dictionary['doc_1']) }, [])

    // Function to handle checkbox change
    const handleCheckboxChange = (e) => {

        setCheckDoc(ch => ({ ...ch, doc_1: e.target.checked }))
    };

    const handleCheckboxChangePrompt = (e) => {

        setCheckDoc(ch => ({ ...ch, doc_2: e.target.checked }))
    };


    async function fetchChromeRequest() {


        const promptDoc = checkDoc.doc_2 ? await fetchDocument(docs_dictionary['doc_2']) : "";
        const uploadedPDF = checkDoc.doc_1 ? await fetchDocument(docs_dictionary['doc_1']) : "";

        setEmoji("👽");

        try {
            const response = await callBackendCompletionGPT4(promptDoc, inputValue + uploadedPDF);
            const updatePrompt = inputValue + "\n\n" + response;

            setInputValue(updatePrompt);
            setEmoji("🧠");

        } catch (error) {
            setEmoji("🧠")

            console.error(error);
        }
    };


    return (
        <div style={{ background: 'linear-gradient(to bottom, #333333 97%, #87cefa)', display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'aliceblue' }}>
            {/* First row */}
            <div style={{ height: '5%' }} >

            </div>

            {/* Second row */}
            <div style={{ height: '85%', display: 'flex' }}>
                {/* First column */}
                <div style={{ flex: 1 }}>
                    <GrammarlyEditorPlugin
                        clientId={'client_H7wiQ9qgEaLyxUMJef4DQc'}
                    >
                        <Input.TextArea
                            style={{ minHeight: '600px', maxHeight: '100%', fontSize: '17.5px', maxWidth: '95%', padding: '10px', marginLeft: '20px' }}
                            rows={10}
                            placeholder="Provide additional research instructions..."
                            value={inputValue}
                            onChange={(event) => {
                                setInputValue(event.target.value); setCount(event.target.value.length);
                            }}
                            maxLength={10000} // specify your desired length
                        />
                    </GrammarlyEditorPlugin>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right', marginTop:'-30px', marginRight:'20px' }}>
                        <Button
                            onClick={() => { fetchChromeRequest() }}
                            style={{
                                fontSize: "3rem", marginLeft: '8px', display: "flex", justifyContent:
                                    "center", alignItems: "center", backgroundColor:
                                    'transparent', border: '0', marginTop: '-10px'
                            }}>
                            {emoji}
                        </Button>
                    </div>
    

                </div>
                {/* Second column */}
                <div style={{ flex: 1, flexDirection: 'col' }}>
                    {ifr}

                </div>
            </div>

            {/* Third row */}
            <div style={{
                marginRight: '1%', height: '3%', marginTop: '-10px', display: 'flex', flexDirection: 'row', justifyContent: 'right',
                padding: '10px',
            }}>

<div style={{ marginRight: '10px' }}>
    <ModalExplanation/>
    </div>

                {false && <div style={{ marginRight: '10px' }}>
                    <Button
                        onClick={() => {
                            setDocUrl(docs_dictionary['doc_2']);
                        }}
                        icon={<GoogleOutlined style={{ color: 'lightcoral' }} />}
                        style={{ minWidth: '150px', marginRight: '5px' }}
                    >
                        Prompt
                    </Button>
                    <Checkbox checked={checkDoc.doc_2} onChange={handleCheckboxChangePrompt}>
                    </Checkbox>
                </div>}
                <div style={{ marginRight: '10px' }}>
                    <Button
                        onClick={() => {
                            setDocUrl(docs_dictionary['doc_1']);
                        }}
                        icon={<FilePdfTwoTone style={{}} />}
                        style={{ minWidth: '150px', marginRight: '5px' }}
                    >
                        Document
                    </Button>
                    <Checkbox checked={checkDoc.doc_1} onChange={handleCheckboxChange}>
                    </Checkbox>
                </div>
            </div>

        </div>


    );
};

export default ExampleLayout;
