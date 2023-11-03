import React, {  useContext, useState } from 'react'
import GlobalContext from './GlobalContext'

const MyProvider = ({children}) =>{
    const [isSubmited, setIsSubmited] = useState(false)
    const [record, setRecord] = useState(null);
    const [ans,setAns]=useState([]);
   
  return (
    <GlobalContext.Provider value={{
        isSubmited, setIsSubmited,
        record, setRecord,
        ans,setAns
    }}>
        {children}
    </GlobalContext.Provider>
  )
}

const useMyContext = () => {
  return useContext(GlobalContext);
};
export { MyProvider, useMyContext, };