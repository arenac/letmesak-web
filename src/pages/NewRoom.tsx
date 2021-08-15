import { Link } from 'react-router-dom'

import illustrationImg from "../assets/images/illustration.svg"
import logImg from "../assets/images/logo.svg"

import "../styles/auth.scss";
import { Button } from "../components/Button";

export function NewRoom() {

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration for question and answers" />
        <strong>Create Q&amp;A live chat rooms</strong>
        <p>Answer question in real time</p>
      </aside>
      <main>
        <div className="main-container">
          <img src={logImg} alt="Letmeask" />
          
          <h2>Create a new room</h2>

          <form>
            <input 
              type="text" 
              placeholder="Room name"
            />
            <Button type="submit">
              Create room
            </Button>
          </form>

          <p>
            If you want to enter in an existing room, <Link to="/">clique here</Link>
          </p>
        </div>
      </main>
    </div>
  )
}