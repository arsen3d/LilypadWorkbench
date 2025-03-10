import { useState } from 'react';
import './Ipfs.css';
import './Agent.css'; // Import the new CSS file for split screen

export function Agent() {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [bio, setBio] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [speakingStyle, setSpeakingStyle] = useState<string>('');
  const [conversationalScene, setConversationalScene] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [trainingData, setTrainingData] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      profilePhoto,
      bio,
      name,
      speakingStyle,
      conversationalScene,
      trainingData,
      skills,
      selectedAgent,
    });
  };

  const handleSend = () => {
    if (currentMessage.trim() !== '') {
      setMessages([...messages, currentMessage]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="split-screen">
      <div className="left-pane">
        {/* <h1>Chat Interface</h1> */}
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button className="send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="right-pane">
        <div className="agent-profile-container">
          {/* <h1>AI Agent Profile</h1> */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="selectedAgent">Select Agent</label>
              <select
                id="selectedAgent"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                required
              >
                <option value="" disabled>Select an agent</option>
                <option value="agent1">Agent 1</option>
                <option value="agent2">Agent 2</option>
                <option value="agent3">Agent 3</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="profilePhoto">Profile Photo</label>
              <input type="file" id="profilePhoto" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <div className="form-group-name">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="speakingStyle">Speaking Style</label>
              <textarea
                id="speakingStyle"
                value={speakingStyle}
                onChange={(e) => setSpeakingStyle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="conversationalScene">Conversational Scene</label>
              <textarea
                id="conversationalScene"
                value={conversationalScene}
                onChange={(e) => setConversationalScene(e.target.value)}
                required
              />
            </div>
            <div className="form-group-horizontal">
              <div className="form-group">
                <label htmlFor="trainingData">Training Data</label>
                <select
                  id="trainingData"
                  value={trainingData}
                  onChange={(e) => setTrainingData(e.target.value)}
                  required
                >
                  <option value="" disabled>Select training data</option>
                  <option value="data1">Training Data 1</option>
                  <option value="data2">Training Data 2</option>
                  <option value="data3">Training Data 3</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <select
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                >
                  <option value="" disabled>Select skills</option>
                  <option value="skill1">Skill 1</option>
                  <option value="skill2">Skill 2</option>
                  <option value="skill3">Skill 3</option>
                </select>
              </div>
            </div>

          </form>
        </div>
        <button type="submit">Run</button>
      </div>
    </div>
  );
};
