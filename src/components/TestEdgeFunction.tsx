import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function TestEdgeFunction() {
  const [result, setResult] = useState('')
  
  const testFunction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fraud-detection', {
        body: { 
          transactions: [{
            transaction_amount: 100,
            channel: "web",
            timestamp: new Date().toISOString()
          }]
        }
      })
      
      if (error) {
        setResult('Error: ' + error.message)
      } else {
        setResult('Success: ' + JSON.stringify(data))
      }
    } catch (err) {
      setResult('Exception: ' + err.message)
    }
  }
  
  return (
    <div>
      <button onClick={testFunction}>Test Edge Function</button>
      <pre>{result}</pre>
    </div>
  )
}