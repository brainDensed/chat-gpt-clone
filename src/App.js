import { useState, useEffect } from "react";
const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [currentTitle, setCurrentTitle] = useState();
  const [previousChats, setPreviousChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggleDark, setToggleDark] = useState(true);
  const getMessages = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const createNewChat = () => {
    setMessage(null);
    setCurrentTitle(null);
    setValue("");
  };
  const handleClick = (title) => {
    setCurrentTitle(title);
  }
  const handleKeyDown = (e) => {
    if (!loading && e.key === 'Enter') {
      getMessages();
    }
  }
  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);
  console.log(previousChats);
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );
  console.log(uniqueTitles);
  console.log(loading);
  return (
    <>
      {loading && <div id={toggleDark ? 'overlay-dark' : 'overlay'}> <div id={toggleDark ? 'text-dark' : 'text'}>Loading...</div></div >}<div className={toggleDark ? "app-dark" : 'app'} onKeyDown={handleKeyDown}>
        <section className={toggleDark ? "side-bar-dark" : 'side-bar'}>
          <button className={toggleDark ? 'button-dark' : 'button'} onClick={createNewChat}>+ New Chat</button>
          <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => (
              <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
            ))}
          </ul>
          <nav className={toggleDark ? 'nav-dark' : 'nav'}>
            <p>
              Made by <span>Shivam</span>
            </p>
          </nav>
        </section>
        <section className="main">
        <div className="toggle-button"><button className={toggleDark ? 'button-dark mode' : 'button mode'} onClick={() => setToggleDark(!toggleDark)}>{toggleDark ? 'Light Mode' : 'Dark Mode'}</button></div>
          {!currentTitle && <h1>HashGPT</h1>}
          <ul className={toggleDark ? "feed-dark" : 'feed'}>
            {currentChat?.map((chatMessage, index) => (
              <li key={index} className={chatMessage.role === 'user' ? 'user' : 'assistant'}>
                <p className='role'>{chatMessage.role}</p>
                <p className="content">{chatMessage.content}</p>
              </li>
            ))}
          </ul>
          <div className="bottom-section">
            <div className="input-container">
              <textarea className={toggleDark ? 'textarea-dark' : 'textarea'} placeholder="Ask Anything" disabled={loading} value={value} onChange={(e) => setValue(e.target.value)} />
              <div id="submit" onClick={getMessages}>
                ➢
              </div>
            </div>
            <p className={toggleDark ? "info-dark" : 'info'}>
              Free Research Preview. ChatGPT may produce inaccurate information
              about people, places, or facts. ChatGPT May 24 Version.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default App;
