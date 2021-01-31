import Head from "next/head";
import styles from "../styles/Home.module.css";
import Checklist from "../components/Checklist";
import { useState, useRef, useEffect } from 'react';

export default function Home() {

  const nameRef = useRef();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  },[])

  const initialItems = [
    { 
      label: "No contact with person with known or suspected COVID within last 14 days",
      name: "noContact",
      checked: false
    }, 
    { 
      label: "No fever (100.4°F or higher), or a sense of having a fever",
      name: "noFever",
      checked: false
    },
    {
      label: "No new cough that cannot be attributed to another health condition",
      name: "noCough",
      checked: false
    },
    {
      label: "No new shortness of breath that cannot be attributed to another health condition",
      name: "noShort",
      checked: false
    },
    {
      label: "No new sore throat that cannot be attributed to another health condition",
      name: "noSore",
      checked: false
    },
    {
      label: "No new muscle aches that cannot be attributed to another health condition, or that was likely caused by a specific activity",
      name: "noAches",
      checked: false
    }
  ];

  const [ items, setItems ] = useState(initialItems);
  const [ formValid, setFormValid ] = useState(false);
  const [ passed, setPassed ] = useState(false);
  const [ personName, setPersonName ] = useState('');

  const updateItem = (index, value) => {
    const newItems = [...items];
    //set item checked to true
    newItems[index].checked = value;
    setItems(newItems);

    checkFormValid();
  }

  const checkFormValid = () => {
    // make sure all of the checked values are set to true
    setFormValid(items.every(item => item.checked === true));
  }

  const resetForm = () => {
    setPersonName('');
    setItems(initialItems);
    setFormValid(false);
    setPassed(false);
  }

  const submitForm = event => {
    event.preventDefault();
    if (personName && formValid) {
      setPassed(true);
    } else {
      alert('Name is required');
    }
  }

  const sendResults = mode => {
    const smsIos = `sms:&body=${encodeURIComponent(personName)} ${encodeURIComponent(" PASSED their COVID screening today! ✨ View the checklist at http://covidscreen.us")}`;
    const smsAndroid = `sms:?body=${encodeURIComponent(personName)} ${encodeURIComponent(" PASSED their COVID screening today! ✨ View the checklist at http://covidscreen.us")}`;
    const email = `mailto:hello@hello.com?subject=${encodeURIComponent("Covid Screen Pass: ")} ${encodeURIComponent(personName)}&body=${encodeURIComponent(personName)} ${encodeURIComponent(" PASSED their COVID screening today!<br><br>View the checklist at http://covidscreen.us")}`;

    if (mode === 'sms' && iOS()) {
      window.open(smsIos);
    } else if (mode === 'sms' && !iOS()) {
      window.open(smsAndroid);
    } else {
      window.open(email);
    }
  }

  const iOS = () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <div className="w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-0 py-3">
      <Head>
        <title>Covidscreen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="text-4xl font-bold mb-4">
          Covidscreen.us
        </h1>
       
        {!passed &&
        <form>
           <div className="mb-4">Please complete the screening checklist below. Once done, you can forward the results via text or email.</div>

          <input 
            type="text" 
            ref={nameRef}
            className="block w-full rounded-md border border-gray-400 py-2 my-4" 
            placeholder="Name of person being screened" 
            value={personName} 
            onChange={(event) => setPersonName(event.target.value)} 
          />
          <Checklist 
            items={items} 
            updateItem={updateItem} 
          />

          <div className="py-4">
            <input 
              type="submit" 
              value="Submit"
              className="px-4 py-2 text-sm text-gray-100 bg-blue-600 hover:bg-blue-400 rounded-md" 
              disabled={!formValid} 
              onClick={(event) => submitForm(event)} 
            />

            <input 
              type="button" 
              value="Clear" 
              className="px-4 py-2 ml-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" 
              onClick={() => resetForm()} 
            />
          </div>
          
        </form>
        
        }

        {passed &&
          <div>
            <h3 className="mb-4 center">Yay! {personName} passed the screening! ✨</h3>

            <div className="">
              <input 
                type="button" 
                value="Text results" 
                className="px-4 py-2 mr-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => sendResults('sms')} 
              />

              <input 
                type="button" 
                value="Email results" 
                className="px-4 py-2 mr-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => sendResults('email')} 
              />

              <input 
                type="button" 
                value="Copy results" 
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => copyToClipboard(`${personName} PASSED their COVID screening today! ✨ View the checklist at http://covidscreen.us`)} 
              />
            </div>

            <div className="flex flex-wrap content-center">
              <input 
                type="button" 
                value="Back" 
                className="px-4 py-2 mt-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => resetForm()} 
              />
            </div>
            
          </div>
        }

      </main>

      <footer className="w-full flex items-center mt-4">
       © {new Date().getFullYear()} covidscreen.us | Be kind, stay safe 😷
      </footer>
    </div>
  );
}
