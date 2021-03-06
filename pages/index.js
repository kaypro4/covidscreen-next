import Head from "next/head";
import Checklist from "../components/Checklist";
import { useState, useRef, useEffect } from 'react';
import { copyToClipboard, sendSms } from "../components/utils";

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
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }

  const submitForm = event => {
    event.preventDefault();
    if (personName && formValid) {
      setPassed(true);
    } else {
      alert('Name is required');
    }
  }

  const shareResults = mode => {
   const email = `mailto:hello@hello.com?subject=${encodeURIComponent("Covid Screen Pass: ")}${encodeURIComponent(personName)}&body=${encodeURIComponent(personName)}${encodeURIComponent(" PASSED their COVID screening today!  View the checklist at http://covidscreen.us")}`;

    if (mode === 'sms') {
      sendSms(`${encodeURIComponent(personName)}${encodeURIComponent(" PASSED their COVID screening today! ✨ View the checklist at http://covidscreen.us")}`);
    } else if (mode === 'email') {
      window.open(email);
    } else if (mode === 'copy') {
      copyToClipboard(`${personName} PASSED their COVID screening today! ✨ View the checklist at http://covidscreen.us`);
    }
  }

  return (
    <div className="w-full md:max-w-2xl mx-auto flex flex-wrap mt-0 py-3 px-6">
      <Head>
        <title>Covid Screen</title>
        <link rel="icon" href="/favicon.ico" />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-174216278-1"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'UA-174216278-1');
              `,
          }}
        />
      </Head>

      <main className="">
        <h1 className="text-4xl font-bold mb-6 block">
          <img src="/logo.png" className="inline" /> Covidscreen.us
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
              className="px-4 py-2 text-sm text-gray-100 bg-blue-600 hover:bg-blue-400 cursor-pointer rounded-md" 
              disabled={!formValid} 
              onClick={(event) => submitForm(event)} 
            />

            <input 
              type="button" 
              value="Clear" 
              className="px-4 py-2 ml-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md" 
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
                className="px-4 py-2 mr-2 text-sm text-gray-100 bg-blue-600 hover:bg-blue-400 cursor-pointer rounded-md" 
                onClick={() => shareResults('sms')} 
              />

              <input 
                type="button" 
                value="Email results" 
                className="px-4 py-2 mr-2 text-sm text-gray-100 bg-blue-600 hover:bg-blue-400 cursor-pointer rounded-md" 
                onClick={() => shareResults('email')} 
              />

              <input 
                type="button" 
                value="Copy results" 
                className="px-4 py-2 text-sm text-gray-100 bg-blue-600 hover:bg-blue-400 cursor-pointer rounded-md" 
                onClick={() => shareResults('copy')} 
              />
            </div>

            <div className="flex flex-wrap content-center">
              <input 
                type="button" 
                value="Back" 
                className="px-4 py-2 mt-6 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md" 
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