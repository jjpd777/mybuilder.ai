import React, { useState } from 'react';
import { Modal, Button, Card, Input, Divider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';


export default function InstructionsCard({ }) {
    const [isModalVisible, setIsModalVisible] = useState(false);


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <div>
            <Button onClick={showModal} icon={<SettingOutlined />} style={{
                marginRight: '5px', backgroundColor: 'white',
                borderColor: '#4169E1', color: '#4169E1', width: '50px'
            }}>
            </Button>
            <div style={{margin:'0 auto'}}>

            <Modal
                title={<h3 style={{color:'#4169E1'}}>Configuration</h3>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        cancelar
                    </Button>,
                    <Button key="ok" style={{ backgroundColor: 'aliceblue', color: '#4169E1' }} onClick={handleOk}>
                        Guardar
                    </Button>,
                ]}
            >
                    <p style={{}}>Instructions to the GPT-4 API are passed in the order of</p>
                    <li>
                        <ul>Instructions in "Prompt" file</ul>
                        <ul>Instructions as writen on input text field</ul>

                        <ul>Instructions in "Document" file</ul>
                    </li>
                    <Divider/>
                    <p style={{}}>This order applies regardless of the number of documents / instructions ticked as valid.</p>

            </Modal>
            </div>

        </div>
    );
};

