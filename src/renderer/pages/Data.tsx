import React, { useState } from 'react';

const Data = () => {
  const [rows, setRows] = useState([
    ['Explain the main theme of Hamlet.',`The main theme of Shakespeare's *Hamlet* is the complexity of action, particularly the protagonist's struggle with revenge, morality, and the consequences of his decisions.`],
    ['Summarize the plot of Hamlet in a few sentences.',`In *Hamlet*, the young Prince of Denmark seeks revenge against his uncle Claudius, who has murdered Hamlet's father, taken the throne, and married Hamlet's mother. Throughout the play, Hamlet grapples with his conscience, feigns madness, and stages a play to confirm Claudius's guilt. The play ends in tragedy with the deaths of Hamlet, Claudius, Gertrude, Laertes, and Ophelia.`]]);

  const addRow = () => {
    setRows([...rows, ['in', 'out']]);
  };

  return (
    <div  style={{ display: 'flex', height: '100vh',width: "100%" }}>
      {/* <button className="sidebar-button">New Dataset 2</button> */}

      {/* Main Section */}
      <div style={{ display: 'flex', height: '100vh',width: "100%" }}>
        {/* Sidebar */}
        {/* <div style={{ width: '60px', backgroundColor: '#333', padding: '10px', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="sidebar-button" style={{ marginBottom: '10px' }}>New Dataset 2</button>
          <button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '24px', cursor: 'pointer' }}>+</button>
        </div> */}

        {/* Main Section */}
        <div style={{ display: 'flex', height: '100vh',width: "100%"  }}>
          {/* Sidebar */}
          <div style={{ width: '160px', backgroundColor: '#333', padding: '10px', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="sidebar-button" style={{ marginBottom: '10px' }}>New Dataset 2</button>
            <button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '24px', cursor: 'pointer' }}>+</button>
          </div>

          {/* Main Section */}
          <div style={{ flex: 1, backgroundColor: '#1f1f1f', padding: '20px', display: 'flex', flexDirection: 'column' ,width: "100%" }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h1 style={{ color: '#fff' }}>Dataset: <span style={{ color: '#ccc' }}>New Dataset 2</span></h1>
                <p style={{ color: '#888' }}>ID: LkfnNef5jHykFNhwh2DY</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button style={{ marginRight: '10px', backgroundColor: '#007bff', color: '#fff', padding: '5px 10px' }}>Generate Dataset</button>
                <button style={{ marginRight: '10px', backgroundColor: '#007bff', color: '#fff', padding: '5px 10px' }}>Export Dataset</button>
                <button style={{ marginRight: '10px', backgroundColor: '#6c757d', color: '#fff', padding: '5px 10px' }}>Import (Replace) Data</button>
                <button style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px' }}>Clear Data</button>
              </div>
            </div>

            {/* Dataset Table */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{ width: '80%', color: '#fff', borderCollapse: 'collapse' }}>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addRow} style={{ marginTop: '20px', color: 'orange', background: 'none', border: 'none', cursor: 'pointer' }}>Add New Row</button>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default Data;
